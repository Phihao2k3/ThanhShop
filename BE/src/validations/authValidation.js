import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import APIError from "~/utils/APIerror";

const loginValidation = async (req, res, next) => {
  try {
    const correctConditions = Joi.object({
      phone: Joi.string().required().messages({
        "string.base": "Số điện thoại phải là chuỗi",
        "string.empty": "Số điện thoại không được để trống",
        "any.required": "Số điện thoại là trường bắt buộc",
      }),
      password: Joi.string().required().messages({
        "string.base": "Mật khẩu phải là chuỗi",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Mật khẩu là trường bắt buộc",
      }),
    }).unknown(true);
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
export const authValidation = {
  loginValidation,
};
