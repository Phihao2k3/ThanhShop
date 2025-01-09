import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import APIError from "~/utils/APIerror";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
const USERS_COLLECTION__NAME = "users";
const USERS_COLLECTION__SCHEMA = Joi.object({
  username: Joi.string().required().min(3).max(30).trim(),
  password: Joi.string().required().min(6).max(100),
  full_name: Joi.string().required().default(""),
  gender: Joi.string().valid("Nam", "Nữ", "Khác").default("Nam"),
  birth_date: Joi.date().iso().default(null),
  email: Joi.string().email().required().lowercase(),
  role: Joi.string().valid("user", "admin", "moderator").default("user"),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional(),
  address: Joi.string().optional(),
  shipping_address: Joi.array().items(Joi.string()).optional(),
  avatar: Joi.string().uri().optional(),
  loyalty_points: Joi.number().min(0).default(0),
  last_login: Joi.date().timestamp("javascript").default(Date.now()), // Use current timestamp if not provided
  created_at: Joi.date().timestamp("javascript").default(Date.now()), // Use current timestamp if not provided
  updated_at: Joi.date().timestamp("javascript").default(null), // Use null if not provided
  is_active: Joi.boolean().default(true),
}).unknown(true);

const validateBeforeCreate = async (data) => {
  return await USERS_COLLECTION__SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const exists = await checkExists(validData);
    if (exists) {
      throw new APIError(
        StatusCodes.CONFLICT,
        "Email hoặc số điện thoại đã tồn tại"
      );
    }
    const createUsers = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .insertOne(validData);
    return createUsers;
  } catch (error) {
    // Kiểm tra và ném lỗi với thông tin cụ thể
    const details = error.errors;

    throw new APIError(error.statusCode || 500, error.message, details);
  }
};

const checkExists = async (data) => {
  try {
    // Kiểm tra nếu email hoặc phone đã tồn tại trong cơ sở dữ liệu
    const user = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .findOne({ $and: [{ phone: data.phone }, { email: data.email }] });
    return user !== null; // Trả về true nếu tồn tại người dùng
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const user = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .findOne({ _id: new ObjectId(id) });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};
const getAll = async ({ page = 1, limit = 10, sort = "desc", search = "" }) => {
  const MAX_LIMIT = 100; // Giới hạn tối đa
  try {
    // Giới hạn tối đa cho limit
    limit = Math.min(limit, MAX_LIMIT);

    const skip = (page - 1) * limit;

    // Tính tổng số bản ghi
    const totalUsers = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .countDocuments();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalUsers / limit);

    // Lấy dữ liệu phân trang
    const users = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ],
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
        total: totalUsers, // Tổng số bản ghi
        page, // Trang hiện tại
        limit, // Số bản ghi trên mỗi trang
        totalPages, // Tổng số trang
      },
      data: users, // Dữ liệu trên trang hiện tại
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const usersModel = {
  USERS_COLLECTION__NAME,
  USERS_COLLECTION__SCHEMA,
  createNew,
  findOneById,
  getAll,
};
