import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import APIError from "~/utils/APIerror";

const createNew = async (req, res, next) => {
  const correctConditions = Joi.object({
    username: Joi.string().min(6).max(30).required().messages({
      "string.base": "Tên người dùng phải là chuỗi",
      "string.empty": "Tên người dùng không được để trống",
      "string.min": "Tên người dùng phải có ít nhất {#limit} ký tự",
      "string.max": "Tên người dùng không được vượt quá {#limit} ký tự",
      "any.required": "Tên người dùng là trường bắt buộc",
    }),
    password: Joi.string().min(6).max(30).required().messages({
      "string.base": "Mật khẩu phải là chuỗi",
      "string.empty": "Mật khẩu không được để trống",
      "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
      "string.max": "Mật khẩu không được vượt quá {#limit} ký tự",
      "any.required": "Mật khẩu là trường bắt buộc",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email phải là chuỗi",
      "string.empty": "Email không được để trống",
      "string.email": "Email không hợp lệ",
      "any.required": "Email là trường bắt buộc",
    }),
    full_name: Joi.string().min(6).max(30).required().messages({
      "string.base": "Tên đầy đủ phải là chuỗi",
      "string.empty": "Tên đầy đủ không được để trống",
      "string.min": "Tên đầy đủ phải có ít nhất {#limit} ký tự",
      "string.max": "Tên đầy đủ không được vượt quá {#limit} ký tự",
      "any.required": "Tên đầy đủ là trường bắt buộc",
    }),
    gender: Joi.string().valid("Nam", "Nữ", "Khác").required().messages({
      "string.base": "Giới tính phải là chuỗi",
      "string.empty": "Giới tính không được để trống",
      "any.only": "Giới tính không hợp lệ",
      "any.required": "Giới tính là trường bắt buộc",
    }),
    birthday: Joi.date().iso().required().messages({
      "date.base": "Ngày sinh phải là ngày",
      "date.empty": "Ngày sinh không được để trống",
      "any.required": "Ngày sinh là trường bắt buộc",
      "date.iso": "Ngày sinh phải có định dạng ISO",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10,11}$/)
      .required()
      .messages({
        "string.base": "Số điện thoại phải là chuỗi",
        "string.empty": "Số điện thoại không được để trống",
        "string.pattern.base": "Số điện thoại không hợp lệ",
        "any.required": "Số điện thoại là trường bắt buộc",
      }),
    address: Joi.string().min(6).max(100).required().messages({
      "string.base": "Địa chỉ phải là chuỗi",
      "string.empty": "Địa chỉ không được để trống",
      "string.min": "Địa chỉ phải có ít nhất {#limit} ký tự",
      "string.max": "Địa chỉ không được vượt quá {#limit} ký tự",
      "any.required": "Địa chỉ là trường bắt buộc",
    }),
  }).unknown(true);

  try {
    

    await correctConditions.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const { details } = error;

    // Chuyển các lỗi thành một object
    const errorObj = details.reduce((acc, { message, path }) => {
      acc[path[0]] = message; // Path là mảng, bạn có thể sử dụng path[0] để lấy tên trường
      return acc;
    }, {});

    // Trả về lỗi với thông báo chi tiết và đối tượng lỗi
    next(
      new APIError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Dữ liệu không hợp lệ", // Mô tả lỗi chung
        errorObj // Trả về đối tượng chứa lỗi chi tiết
      )
    );
  }
};

export const usersValidation = {
  createNew,
};
