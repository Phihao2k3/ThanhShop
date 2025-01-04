import express from "express";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import {
  GET_DB,
  CONNECT_MONGODB,
  CLOSE_MONGODB_CONNECTION,
} from "./config/mongodb";
import { API_V1 } from "./routes/v1";
import { ErrorhandlingMiddleware } from "./middlewares/ErrorhandlingMiddleware";
const START_SERVER = () => {
  const app = express();

  app.use(express.json());

  app.use("/api/v1", API_V1);
  // middleware xử lý lỗi
  app.use(ErrorhandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `3.Server Đang chạy tại http://${env.APP_HOST}:${env.APP_PORT}`
    );
  });
  exitHook(() => {
    console.log(`Đang đóng kết nối đến MongoDB...`);
    CLOSE_MONGODB_CONNECTION();
    console.log(`Đã đóng kết nối đến MongoDB!`);
  });
};
(async () => {
  try {
    console.log("1.Đang kết nối đến MongoDB...");
    await CONNECT_MONGODB();
    console.log("2.Kết nối đến MongoDB thành công!");
    START_SERVER();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("CONNECT_MONGODB -> error", error);
    process.exit(1);
  }
})();
process.on("exit", (code) => {
  console.log(`Process exit with code: ${code}`);
});
