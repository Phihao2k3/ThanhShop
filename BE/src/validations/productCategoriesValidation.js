import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import APIError from "~/utils/APIerror";
const createNew = async (req, res, next) => {
  const correctConditions = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Tên danh mục sản phẩm phải là chuỗi",
      "string.empty": "Tên danh mục sản phẩm không được để trống",
      "any.required": "Tên danh mục sản phẩm là trường bắt buộc",
    }),
    description: Joi.string().min(0).max(500).messages({
      "string.base": "Mô tả danh mục sản phẩm phải là chuỗi",
      "string.empty": "Mô tả danh mục sản phẩm không được để trống",
      "string.max":
        "Mô tả danh mục sản phẩm không được vượt quá {#limit} ký tự",
    }),
  }).unknown(true);
  try {
    await correctConditions.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const { details } = error;
    const errorObject = details.reduce((acc, { message, path }) => {
      acc[path[0]] = message;
      return acc;
    }, {});
    next(
      new APIError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Dữ liệu không hợp lệ",
        errorObject
      )
    );
  }
};
const updateOne = async (req, res, next) => {
  const correctConditions = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Tên danh mục sản phẩm phải là chuỗi",
      "string.empty": "Tên danh mục sản phẩm không được để trống",
      "any.required": "Tên danh mục sản phẩm là trường bắt buộc",
    }),
    description: Joi.string().min(0).max(500).messages({
      "string.base": "Mô tả danh mục sản phẩm phải là chuỗi",
      "string.empty": "Mô tả danh mục sản phẩm không được để trống",
      "string.max":
        "Mô tả danh mục sản phẩm không được vượt quá {#limit} ký tự",
    }),
  }).unknown(true);
  try {
    await correctConditions.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const { details } = error;
    const errorObject = details.reduce((acc, { message, path }) => {
      acc[path[0]] = message;
      return acc;
    }, {});
    next(
      new APIError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Dữ liệu không hợp lệ",
        errorObject
      )
    );
  }
};
export const productCategoriesValidation = {
  createNew,
  updateOne
};
