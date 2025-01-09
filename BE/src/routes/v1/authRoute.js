import express from "express";
import { StatusCodes } from "http-status-codes";
const Router = express.Router();
import { authValidation } from "~/validations/authValidation";
import { AuthController } from "~/controllers/authController";
Router.post("/login", authValidation.loginValidation, AuthController.loginUser);

export const AuthRoute = Router;
