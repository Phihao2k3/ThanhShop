import APIError from "~/utils/APIerror";
import { slugify } from "~/utils/formatters";
import { productsModel } from "~/models/productsModel";

const createNew = async (data, files) => {
  try {
    const listImage = files ? files.map((file) => file?.filename) : [];
  
    
    const newProduct = {
      ...data,

      image_url: files ? files[0]?.filename : null,
      slug: slugify(data.name),
    };
    //  thêm sản phẩm mới
    const createProduct = await productsModel.createNew(newProduct, listImage);

    //  lấy ra sản phẩm vừa thêm
    const getNewProduct = await productsModel.findOneById(
      createProduct.insertedId
    );
    return getNewProduct;
  } catch (error) {
    throw error;
  }
};
const deleteOne = async (id) => {
  try {
    const product = await productsModel.deleteOne(id);
    return product;
  } catch (error) {
    throw error;
  }
};
const getAll = async (query) => {
  try {
    const products = await productsModel.getAll(query);
    return products;
  } catch (error) {
    throw error;
  }
};
const getOne = async (id) => {
  try {
    const product = await productsModel.findOneById(id);

    return product;
  } catch (error) {
    throw error;
  }
};
const updateOne = async (id, data, files) => {
  try {
    const listImage = files ? files.map((file) => file?.filename) : [];
    const newdata = {
      ...data,
      image_url: files ? files[0]?.filename : data.image_url,
      slug: slugify(data.name),
    };
    const updateProduct = await productsModel.updateOne(id, newdata, listImage);
    return updateProduct;
  } catch (error) {
    throw error;
  }
};
export const productsService = {
  createNew,
  getAll,
  deleteOne,
  getOne,
  updateOne,
};
