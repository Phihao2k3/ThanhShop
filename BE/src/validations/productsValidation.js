import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import APIError from "~/utils/APIerror";
import { json } from "express";
import { OBJECT_ID_RULE } from "~/utils/validators";
const createNew = async (req, res, next) => {
  const correctConditions = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Tên sản phẩm phải là chuỗi",
      "string.empty": "Tên sản phẩm không được để trống",
      "any.required": "Tên sản phẩm là trường bắt buộc",
    }),
    price: Joi.number().required().min(0).messages({
      "number.base": "Giá sản phẩm phải là số",
      "number.empty": "Giá sản phẩm không được để trống",
      "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}",
      "any.required": "Giá sản phẩm là trường bắt buộc",
    }),
    description: Joi.string().required().min(10).max(500).messages({
      "string.base": "Mô tả sản phẩm phải là chuỗi",
      "string.empty": "Mô tả sản phẩm không được để trống",
      "string.min": "Mô tả sản phẩm phải có ít nhất {#limit} ký tự",
      "string.max": "Mô tả sản phẩm không được vượt quá {#limit} ký tự",
      "any.required": "Mô tả sản phẩm là trường bắt buộc",
    }),
    quantity: Joi.number().required().min(0).messages({
      "number.base": "Số lượng sản phẩm phải là số",
      "number.empty": "Số lượng sản phẩm không được để trống",
      "number.min": "Số lượng sản phẩm không được nhỏ hơn {#limit}",
      "any.required": "Số lượng sản phẩm là trường bắt buộc",
    }),
    category_id: Joi.string().pattern(OBJECT_ID_RULE).required().messages({
      "string.base": "ID danh mục sản phẩm phải là chuỗi",
      "string.empty": "ID danh mục sản phẩm không được để trống",
      "string.pattern.base": "ID danh mục sản phẩm không hợp lệ",
      "any.required": "ID danh mục sản phẩm là trường bắt buộc",
    }),
  }).unknown(true);
  try {
    await correctConditions.validateAsync(req.body, { abortEarly: false });
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
const updateProduct = async (req, res, next) => {
  try {
    const correctConditions = Joi.object({
      name: Joi.string().min(3).max(100).trim().messages({
        "string.base": "Tên sản phẩm phải là chuỗi",
        "string.min": "Tên sản phẩm phải có ít nhất {#limit} ký tự",
        "string.max": "Tên sản phẩm không được vượt quá {#limit} ký tự",
      }),
      price: Joi.number().min(0).messages({
        "number.base": "Giá sản phẩm phải là số",
        "number.min": "Giá sản phẩm không được nhỏ hơn {#limit}",
      }),
      description: Joi.string().min(10).max(500).messages({
        "string.base": "Mô tả sản phẩm phải là chuỗi",
        "string.min": "Mô tả sản phẩm phải có ít nhất {#limit} ký tự",
        "string.max": "Mô tả sản phẩm không được vượt quá {#limit} ký tự",
      }),
      quantity: Joi.number().min(0).messages({
        "number.base": "Số lượng sản phẩm phải là số",
        "number.min": "Số lượng sản phẩm không được nhỏ hơn {#limit}",
      }),
      category_id: Joi.string().pattern(OBJECT_ID_RULE).messages({
        "string.base": "ID danh mục sản phẩm phải là chuỗi",
        "string.pattern.base": "ID danh mục sản phẩm không hợp lệ",
      }),
    }).unknown(true);
    await correctConditions.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(error);
  }
};
export const productsValidation = {
  createNew,
  updateProduct,
};
