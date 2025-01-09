import { StatusCodes } from "http-status-codes";
import { AuthService } from "~/services/authService";
const loginUser = async (req, res, next) => {
  try {
    const result = await AuthService.login(req.body);
    res
      .status(StatusCodes.OK)
      .json({
        accessToken: result.accessToken,
        message: "Đăng nhập thành công",
      });
  } catch (error) {
    next(error);
  }
};
export const AuthController = {
  loginUser,
};
