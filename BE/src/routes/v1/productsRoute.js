import express from "express";
import { productsValidation } from "~/validations/productsValidation";
import { productController } from "~/controllers/productController";
import upload from "~/middlewares/uploadMiddleware";
const Router = express.Router();
Router.route("/")
  .get(productController.getAll)
  .post(
    upload.array("image_url", 5),
    productsValidation.createNew,
    productController.createNew
  );
Router.route("/:id")
  .delete(productController.deleteOne)
  .get(productController.getOne)
  .put(
    upload.array("image_url", 5),
    productsValidation.updateProduct,
    productController.updateOne
  );

export const PRODUCTS_ROUTE = Router;
