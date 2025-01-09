import express from "express";
const Router = express.Router();
import { StatusCodes } from "http-status-codes";

import { USER_ROUTE } from "./userRoute";
import { PRODUCTS_ROUTE } from "./productsRoute";
import { PRODUCT_CATEGORIES_ROUTE } from "./productCategoriesRoute";
import { CART_ROUTE } from "./cartRoute";
Router.use("/users", USER_ROUTE);
Router.use("/products", PRODUCTS_ROUTE);
Router.use("/productCategories", PRODUCT_CATEGORIES_ROUTE);
Router.use("/carts", CART_ROUTE);
export const API_V1 = Router;
