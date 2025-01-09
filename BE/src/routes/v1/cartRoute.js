import express from "express";
import { StatusCodes } from "http-status-codes";
const Router = express.Router();
import { CartController } from "~/controllers/cartController";
import { cartValidation } from "~/validations/cartValidation";
Router.route("/").post(
  cartValidation.addCartValidation,
  CartController.addCart
).get(CartController.getAll);
// xóa sản phẩm trong giỏ hàng
Router.route("/:idCartItem")
  .delete(CartController.deleteCartItem)
  .put(CartController.updatequantityCartItem);

export const CART_ROUTE = Router;
