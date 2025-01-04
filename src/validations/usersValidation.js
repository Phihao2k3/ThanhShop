import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import APIError from "~/utils/APIerror";

const createNew = async (req, res, next) => {
  const correctConditions = Joi.object({
    username: Joi.string().min(6).max(100).required().strict().messages({
      "string.base": "Tên người dùng phải là chuỗi.",
      "string.empty": "Tên người dùng không được để trống.",
      "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự.",
      "string.max": "Tên người dùng phải có nhiều nhất {#limit} ký tự.",
      "any.required": "Tên người dùng không được để trống.",
    }),
    password: Joi.string().min(6).max(100).required().strict().messages({
      "string.base": "Mật khẩu phải là chuỗi.",
      "string.empty": "Mật khẩu không được để trống.",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự.",
      "string.max": "Mật khẩu phải có nhiều nhất {#limit} ký tự.",
      "any.required": "Mật khẩu không được để trống.",
    }),
    email: Joi.string().email().required().strict().messages({
      "string.base": "Email phải là chuỗi.",
      "string.empty": "Email không được để trống.",
      "string.email": "Email không hợp lệ.",
      "any.required": "Email không được để trống.",
    }),
    slug: Joi.string().required().strict().messages({
      "string.base": "Slug phải là chuỗi.",
      "string.empty": "Slug không được để trống.",
      "any.required": "Slug không được để trống.",
    }),
    avatar: Joi.string().required().strict().messages({
      "string.base": "Avatar phải là chuỗi.",
      "string.empty": "Avatar không được để trống.",
      "any.required": "Avatar không được để trống.",
    }),
    address: Joi.string().required().strict().messages({
      "string.base": "Địa chỉ phải là chuỗi.",
      "string.empty": "Địa chỉ không được để trống.",
      "any.required": "Địa chỉ không được để trống.",
    }),
    role: Joi.string().required().strict().messages({
      "string.base": "Vai trò phải là chuỗi.",
      "string.empty": "Vai trò không được để trống.",
      "any.required": "Vai trò không được để trống.",
    }),
    created_at: Joi.date().required().strict().messages({
      "date.base": "Ngày tạo phải là ngày.",
      "date.empty": "Ngày tạo không được để trống.",
      "any.required": "Ngày tạo không được để trống.",
    }),
    deleted_at: Joi.date().strict().messages({
      "date.base": "Ngày xóa phải là ngày.",
      "date.empty": "Ngày xóa không được để trống.",
    }),
    updated_at: Joi.date().strict().messages({
      "date.base": "Ngày cập nhật phải là ngày.",
      "date.empty": "Ngày cập nhật không được để trống.",
    }),
    email_verified_at: Joi.date().strict().messages({
      "date.base": "Ngày xác nhận email phải là ngày.",
      "date.empty": "Ngày xác nhận email không được để trống.",
    }),
  });
  try {
    await correctConditions.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new APIError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
export const usersValidation = {
  createNew,
};
