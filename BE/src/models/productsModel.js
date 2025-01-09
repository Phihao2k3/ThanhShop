import { StatusCodes } from "http-status-codes";
import APIError from "~/utils/APIerror";
const fs = require("fs");
const path = require("path");
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { ObjectId } from "mongodb";
import { productCategoriesModel } from "./productCategoriesModel";
// tạo bảng
const PRODUCTS_COLLECTION__NAME = "products";
const PRODUCTS_IMG_COLLECTION__NAME = "productImages";
const PRODUCTS_COLLECTION__SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(100).trim(),
  description: Joi.string().required().min(10).max(500),
  price: Joi.number().required().min(0),
  quantity: Joi.number().required().min(0),
  category_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  // object
  image_url: Joi.string().default(null),
  created_at: Joi.date().timestamp("javascript").default(Date.now()),
  updated_at: Joi.date().timestamp("javascript").default(null),
  is_active: Joi.boolean().default(true),
}).unknown(true);
const PRODUCTS_IMG_COLLECTION__SCHEMA = Joi.object({
  product_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  image_url: Joi.string().required().min(3).max(100).trim(),
  created_at: Joi.date().timestamp("javascript").default(Date.now()),
  updated_at: Joi.date().timestamp("javascript").default(null),
}).unknown(true);
const validateBeforeCreate = async (data) => {
  return await PRODUCTS_COLLECTION__SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const createNew = async (data, listImage) => {
  try {
    const validData = await validateBeforeCreate(data);
    const exists = await checkExists(validData);
    if (exists) {
      throw new APIError(StatusCodes.CONFLICT, "Tên sản phẩm đã tồn tại");
    }
    const categoryExists = await productCategoriesModel.findOneById(
      validData.category_id
    );
    if (!categoryExists) {
      throw new APIError(
        StatusCodes.NOT_FOUND,
        "Danh mục sản phẩm không tồn tại"
      );
    }
    // set category_id to ObjectId
    validData.category_id = new ObjectId(validData.category_id);

    const createProduct = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .insertOne(validData);

    if (listImage.length > 0) {
      const listImageProduct = listImage.map((image) => ({
        product_id: createProduct.insertedId,
        image_url: image,
      }));
      await GET_DB()
        .collection(PRODUCTS_IMG_COLLECTION__NAME)
        .insertMany(listImageProduct);
    }
    return createProduct;
  } catch (error) {
    throw new APIError(error.statusCode || 500, error.message, error.errors);
  }
};
const checkExists = async (data) => {
  try {
    const product = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .findOne({
        $or: [{ name: data.name }],
      });
    return product !== null;
  } catch (error) {
    throw new Error(error);
  }
};
// tìm sản phẩm theo id
const findOneById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    const product = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } }, // Tìm sản phẩm theo ID
        {
          $lookup: {
            from: PRODUCTS_IMG_COLLECTION__NAME,
            localField: "_id",
            foreignField: "product_id",
            as: "images",
          },
        },
        // Chuyển category_id sang ObjectId để nối với _id trong product_categories
        {
          $lookup: {
            from: productCategoriesModel.PRODUCT_CATEGORIES_COLLECTION__NAME,
            localField: "category_id", // Trường category_id trong bảng products
            foreignField: "_id", // Trường _id trong bảng product_categories
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true, // Giữ lại kết quả khi không có category
          },
        },
      ])
      .toArray();

    if (product.length === 0) {
      console.log("Không tìm thấy sản phẩm.");
      return null;
    }

    console.log("Sản phẩm và danh mục: ", product);
    return product[0];
  } catch (error) {
    console.error("Error in findOneById:", error);
    throw new Error(error.message || "Lỗi khi lấy sản phẩm.");
  }
};

const getAll = async ({ page = 1, limit = 10, sort = "desc", search = "" }) => {
  const MAX_LIMIT = 100; // Giới hạn tối đa
  try {
    // Giới hạn tối đa cho limit
    limit = Math.min(limit, MAX_LIMIT);

    const skip = (page - 1) * limit;

    // Tính tổng số bản ghi
    const totalproduct = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .countDocuments();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalproduct / limit);

    // Lấy dữ liệu phân trang
    const product = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .find({
        $or: [{ name: { $regex: search, $options: "i" } }],
      })
      .sort({ ["created_at"]: sort === "desc" ? -1 : 1 }) // Sắp xếp theo thời gian tạo
      .skip(skip) // Bỏ qua số bản ghi
      .limit(limit) // Giới hạn số bản ghi tối đa
      .toArray();

    // Tạo danh sách trang gọn gàng
    const pages = [];
    if (totalPages <= 5) {
      // Hiển thị tất cả các trang nếu ít hơn hoặc bằng 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị trang đầu, trang cuối và các trang lân cận
      pages.push(1); // Trang đầu
      if (page > 3) pages.push("..."); // Dấu "..."

      // Các trang lân cận (trang hiện tại -1, hiện tại, hiện tại +1)
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(page + 1, totalPages - 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("..."); // Dấu "..."
      pages.push(totalPages); // Trang cuối
    }

    // Tạo kết quả trả về
    return {
      meta: {
        total: totalproduct, // Tổng số bản ghi
        page, // Trang hiện tại
        limit, // Số bản ghi trên mỗi trang
        totalPages, // Tổng số trang
      },
      data: product, // Dữ liệu trên trang hiện tại
    };
  } catch (error) {
    throw new Error(error);
  }
};
//
const deleteOne = async (id) => {
  try {
    // Kiểm tra ObjectId hợp lệ
    if (!ObjectId.isValid(id)) {
      throw new Error("ID không hợp lệ");
    }

    const objectId = new ObjectId(id);

    // Kiểm tra sản phẩm tồn tại
    const productExists = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .findOne({ _id: objectId });

    if (!productExists) {
      throw new Error("Sản phẩm không tồn tại");
    }

    // Lấy danh sách hình ảnh liên quan
    const productImages = await GET_DB()
      .collection(PRODUCTS_IMG_COLLECTION__NAME)
      .find({ product_id: objectId })
      .toArray();

    // Xóa sản phẩm khỏi cơ sở dữ liệu
    const deleteProduct = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .deleteOne({ _id: objectId });

    // Xóa hình ảnh khỏi cơ sở dữ liệu
    const deleteProductImages = await GET_DB()
      .collection(PRODUCTS_IMG_COLLECTION__NAME)
      .deleteMany({ product_id: objectId });

    // Xóa tệp hình ảnh từ thư mục
    console.log(productImages);

    for (const img of productImages) {
      if (img.path) {
        const filePath = path.join(__dirname, "../uploads/products", img.path); // Thay "../uploads" bằng thư mục lưu trữ thực tế
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Không thể xóa tệp: ${filePath}. Lỗi: ${err.message}`);
        }
      }
    }

    return {
      productDeleted: deleteProduct.deletedCount,
      imagesDeleted: deleteProductImages.deletedCount,
      filesDeleted: productImages.length,
    };
  } catch (error) {
    throw new Error(error.message || "Lỗi khi xóa sản phẩm");
  }
};
// Cập nhật sản phẩm
const updateOne = async (id, data, files) => {
  try {
    // Validate dữ liệu trước khi update
    const validData = await validateBeforeCreate(data);

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      throw new APIError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    // Kiểm tra danh mục sản phẩm
    const categoryExists = await productCategoriesModel.findOneById(
      validData.category_id
    );

    if (!categoryExists) {
      throw new APIError(
        StatusCodes.NOT_FOUND,
        "Danh mục sản phẩm không tồn tại"
      );
    }

    // Xử lý cập nhật hình ảnh
    if (files && files.length > 0) {
      // Lấy danh sách hình ảnh cũ từ DB
      const oldImages = await GET_DB()
        .collection(PRODUCTS_IMG_COLLECTION__NAME)
        .find({ product_id: new ObjectId(id) })
        .toArray();

      // Xóa các hình ảnh cũ trong thư mục upload
      oldImages.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "../uploads/products",
          image.image_url
        ); // Đường dẫn tới thư mục upload
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Xóa tệp
        }
      });

      // Xóa hình ảnh cũ trong DB
      await GET_DB()
        .collection(PRODUCTS_IMG_COLLECTION__NAME)
        .deleteMany({ product_id: new ObjectId(id) });

      // Lưu các hình ảnh mới vào DB
      const newImages = files.map((file) => ({
        product_id: new ObjectId(id),
        image_url: file,
      }));

      await GET_DB()
        .collection(PRODUCTS_IMG_COLLECTION__NAME)
        .insertMany(newImages);
    }

    // Chuyển `category_id` sang ObjectId
    validData.category_id = new ObjectId(validData.category_id);
    validData.updated_at = new Date();
    
    // Cập nhật thông tin sản phẩm
    const updateResult = await GET_DB()
      .collection(PRODUCTS_COLLECTION__NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: validData });

    return updateResult;
  } catch (error) {
    throw new APIError(error.statusCode || 500, error.message, error.errors);
  }
};

export const productsModel = {
  createNew,
  findOneById,
  getAll,
  deleteOne,
  updateOne,
};
