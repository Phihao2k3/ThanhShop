import express from "express";
import { StatusCodes } from "http-status-codes";
const Router = express.Router();
import { usersValidation } from "~/validations/usersValidation";
import { usersController } from "~/controllers/userController";
Router.route("/")
  .get(usersController.getAll)
  .post(usersValidation.createNew, usersController.createNew);
Router.route("/:id").get(usersController.getByid);

export const USER_ROUTE = Router;
