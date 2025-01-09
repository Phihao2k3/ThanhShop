import jwt from "jsonwebtoken";
import { env } from "~/config/environment";
import APIError from "~/utils/APIerror";
const jwtMiddleware = (req, res, next) => {
  try {
    // Lấy token từ tiêu đề Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APIError(401, "Không tìm thấy token");
    }

    const token = authHeader.split(" ")[1]; // Loại bỏ "Bearer "

    // Xác minh token
    const secretKey = env.JWT_KEY;
    const decoded = jwt.verify(token, secretKey);

    // Gắn thông tin người dùng vào request
    req.user = decoded;

    next(); // Tiếp tục xử lý request
  } catch (error) {
    throw new APIError(401, "Token không hợp lệ hoặc không tồn tại");
  }
};

export default jwtMiddleware;
