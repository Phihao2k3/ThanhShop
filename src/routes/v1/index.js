import express from "express";
const Router = express.Router();
import { StatusCodes } from "http-status-codes";

import { USER_ROUTE } from "./userRoute";
Router.use("/users", USER_ROUTE);

export const API_V1 = Router;
