import { productCategoriesModel } from "~/models/productCategoriesModel";
import APIError from "~/utils/APIerror";
import { slugify } from "~/utils/formatters";
const createNew = async (data) => {
  try {
    const newProductCategory = {
      ...data,
      slug: slugify(data.name),
    };
    const createProductCategory = await productCategoriesModel.createNew(
      newProductCategory
    );
    const getnewProductCategory = await productCategoriesModel.findOneById(
      createProductCategory.insertedId
    );
    return getnewProductCategory;
  } catch (error) {
    throw error;
  }
};
const getAll = async () => {
  try {
    const getAllProductCategories = await productCategoriesModel.getAll();
    return getAllProductCategories;
  } catch (error) {
    throw error;
  }
};
const findOneById = async (id) => {
  try {
    const findOneProductCategory = await productCategoriesModel.findOneById(id);
    return findOneProductCategory;
  } catch (error) {
    throw error;
  }
};
const deleteOne = async (id) => {
  try {
    const deleteProductCategory = await productCategoriesModel.deleteOne(id);
    return deleteProductCategory;
  } catch (error) {
    throw error;
  }
};
const updateOne = async (id, data) => {
  try {
    const newdata = {
      ...data,
      slug: slugify(data.name),
    };
    const updateProductCategory = await productCategoriesModel.updateOne(
      id,
      newdata
    );
    return updateProductCategory;
  } catch (error) {
    throw error;
  }
};
export const productCategoriesService = {
  createNew,
  getAll,
  findOneById,
  deleteOne,
  updateOne,
};
