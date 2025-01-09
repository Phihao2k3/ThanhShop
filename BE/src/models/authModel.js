import Joi from "joi";
import APIError from "~/utils/APIerror";
import { StatusCodes } from "http-status-codes";
import { GET_DB } from "~/config/mongodb";
import { checkPassword } from "~/utils/hashPassword";

const USER_COLLECTION = "users";

// Schema validation
const LOGIN_SCHEMA = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
}).unknown(true);

// Validate login input
const loginValidation = async (data) => {
  return LOGIN_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const login = async (data) => {
  try {
    // Validate input
    const validation = await loginValidation(data);

    // Find user by phone
    const result = await GET_DB()
      .collection(USER_COLLECTION)
      .findOne({ phone: validation.phone });

    if (!result) {
      throw new APIError(StatusCodes.UNAUTHORIZED, "Sai thông tin đăng nhập", {
        phone: "Số điện thoại không tồn tại",
      });
    }

    // Check mật khẩu
    const isPasswordCorrect = await checkPassword(
      validation.password,
      result.password
    );

    if (!isPasswordCorrect) {
      throw new APIError(StatusCodes.UNAUTHORIZED, "Sai thông tin đăng nhập", {
        password: "Mật khẩu không đúng",
      });
    }

    // Xoá mật khẩu trước khi trả về
    delete result.password;
    // cập nhât lastLogin
    await GET_DB()
      .collection(USER_COLLECTION)
      .updateOne(
        { phone: validation.phone },
        { $set: { last_login: new Date() } }
      );

    return result;
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      errors: error.errors || {}, // Log errors rõ ràng
    });

    // Nếu không có error.errors, thiết lập là object rỗng
    throw new APIError(
      error.statusCode || 500,
      error.message,
      error.errors || {}
    );
  }
};

// Export Auth Model
export const AuthModel = {
  login,
};
