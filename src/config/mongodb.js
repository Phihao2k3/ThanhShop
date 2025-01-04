// Import các biến môi trường từ file .env
import "dotenv/config";
import { env } from "./environment";

import { MongoClient, ServerApiVersion } from "mongodb";
let ThanhShopDBInstance = null;
// khởi tạo kết nối đến MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const CONNECT_MONGODB = async () => {
  // gọi kết nối đến MongoDB
  await mongoClientInstance.connect();
  // kết nối thành công thì gán kết nối vào biến global
  ThanhShopDBInstance = mongoClientInstance.db(env.MONGODB_DB_NAME);
};

// hàm lấy kết nối đến MongoDB đã được kết nối trước đó từ CONNECT_MONGODB function ở trên ra ngoài cho các file khác sử dụng được kết nối đó mà không cần phải kết nối lại
export const GET_DB = () => {
  if (!ThanhShopDBInstance) throw new Error("Vui lòng kết nối đến MongoDB");
  return ThanhShopDBInstance;
};
export const CLOSE_MONGODB_CONNECTION = async () => {
  await mongoClientInstance.close();
};
