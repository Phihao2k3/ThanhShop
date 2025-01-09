import { StatusCodes } from "http-status-codes";
import { productCategoriesService } from "~/services/productCategoriesService";
const createNew = async (req, res, next) => {
  try {
    const createNew = await productCategoriesService.createNew(req.body);

    res.status(StatusCodes.CREATED).json({
      data: createNew,
      message: "Tạo danh mục sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const getAll = await productCategoriesService.getAll();
    res.status(StatusCodes.OK).json({
      data: getAll,
      message: "Lấy danh sách danh mục sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const findOneById = async (req, res, next) => {
  try {
    const findOneById = await productCategoriesService.findOneById(
      req.params.id
    );
    res.status(StatusCodes.OK).json({
      data: findOneById,
      message: "Lấy danh mục sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const deleteOne = async (req, res, next) => {
  try {
    const deleteOne = await productCategoriesService.deleteOne(req.params.id);
    res.status(StatusCodes.OK).json({
      data: deleteOne,
      message: "Xóa danh mục sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const updateOne = async (req, res, next) => {
  try {
    const updateOne = await productCategoriesService.updateOne(
      req.params.id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      data: updateOne,
      message: "Cập nhật danh mục sản phẩm thành công!",
    });
  } catch (error) {
    next(error);
  }
};
export const productCategoriesController = {
  createNew,
  getAll,
  findOneById,
  deleteOne,
  updateOne,
};
