import { StatusCodes } from "http-status-codes";
import { productsService } from "~/services/productService";
import fs from "fs/promises";
const createNew = async (req, res, next) => {
  try {
    const createProduct = await productsService.createNew(req.body, req.files);
    res.status(StatusCodes.CREATED).json({
      data: createProduct,
      message: "Tạo sản phẩm thành công!",
    });
    next();
  } catch (error) {
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Failed to delete file: ${file.path}`);
        }
      }
    }

    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const products = await productsService.getAll(req.query);
    res.status(StatusCodes.OK).json(products);
  } catch (error) {
    next(error);
  }
};
const deleteOne = async (req, res, next) => {
  try {
    const product = await productsService.deleteOne(req.params.id);
    res.status(StatusCodes.OK).json({
      product,
      message: "Xóa sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const getOne = async (req, res, next) => {
  try {
    const product = await productsService.getOne(req.params.id);
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    next(error);
  }
};
const updateOne = async (req, res, next) => {
  try {
    const updateProduct = await productsService.updateOne(
      req.params.id,
      req.body,
      req.files
    );
    res.status(StatusCodes.OK).json({
      updateProduct,
      message: "Cập nhật sản phẩm thành công!",
    });
  } catch (error) {
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error(`Failed to delete file: ${file.path}`);
        }
      }
    }
    next(error);
  }
};
export const productController = {
  createNew,
  getAll,
  deleteOne,
  getOne,
  updateOne,
};
