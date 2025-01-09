const bcryptjs = require("bcryptjs");

const hashPassword = async (password) => {
  const saltRounds = 10; // Số lần salt
  const hashedPassword = await bcryptjs.hash(password, saltRounds);
  return hashedPassword;
};
const checkPassword = async (password, hashedPassword) => {
  // mật khẩu người dùng nhập vào và mật khẩu đã hash
  const result = await bcryptjs.compare(password, hashedPassword);
  return result;
};
export { hashPassword, checkPassword };
