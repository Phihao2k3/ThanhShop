import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
const PRODUCT_CATEGORIES_COLLECTION__NAME = "product_categories";
const PRODUCT_CATEGORIES_COLLECTION__SCHEMA = Joi.object({
  name: Joi.string().required().min(3).max(100).trim(),
  slug: Joi.string().required().min(3).max(100).trim(),
  description: Joi.string().min(3).max(500),
  is_active: Joi.boolean().default(true),
  created_at: Joi.date().timestamp("javascript").default(Date.now()),
  updated_at: Joi.date().timestamp("javascript").default(null),
}).unknown(true);

const validateBeforeCreate = async (data) => {
  return await PRODUCT_CATEGORIES_COLLECTION__SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const exists = await checkExists(validData);
    if (exists) {
      throw new Error("Danh mục sản phẩm đã tồn tại");
    }
    const createProductCategory = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .insertOne(validData);
    return createProductCategory;
  } catch (error) {
    console.error("Error in createNew:", error);
    throw error;
  }
};

const checkExists = async (data) => {
  try {
    const category = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .findOne({ name: data.name });
    return !!category;
  } catch (error) {
    console.error("Error in checkExists:", error);
    throw error;
  }
};

const findOneById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const categoryOne = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .findOne({ _id: new ObjectId(id) });

    return categoryOne;
  } catch (error) {
    console.error("Error in findOneById:", error);
    throw error;
  }
};
const getAll = async () => {
  try {
    const allCategories = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .find({})
      .toArray();
    return allCategories;
  } catch (error) {
    console.error("Error in getAll:", error);
    throw error;
  }
};
const deleteOne = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const deleteCategory = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .deleteOne({ _id: new ObjectId(id) });

    return deleteCategory;
  } catch (error) {}
};
const updateOne = async (id, data) => {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ObjectId");
    }
    const validData = await validateBeforeCreate(data);
    const updateCategory = await GET_DB()
      .collection(PRODUCT_CATEGORIES_COLLECTION__NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...validData, updated_at: Date.now() } }
      );
    return updateCategory;
  } catch (error) {
    console.error("Error in updateOne:", error);
    throw error;
  }
};
export const productCategoriesModel = {
  createNew,
  findOneById,
  checkExists,
  getAll,
  PRODUCT_CATEGORIES_COLLECTION__NAME,
  deleteOne,
  updateOne,
};
