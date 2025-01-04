import express from "express";
import { StatusCodes } from "http-status-codes";
const Router = express.Router();
import { usersValidation } from "~/validations/usersValidation";
import { usersController } from "~/controllers/userController";
Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({
      message: "Lấy thông tin người dùng thành công!",
    });
  })
  .post(usersValidation.createNew, usersController.createNew);
export const USER_ROUTE = Router;
