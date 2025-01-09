import express from "express";
import { productCategoriesController } from "~/controllers/productCategoriesController";
import { productCategoriesValidation } from "~/validations/productCategoriesValidation";
const Router = express.Router();

Router.route("/")
  .get(productCategoriesController.getAll)
  .post(
    productCategoriesValidation.createNew,
    productCategoriesController.createNew
  );
Router.route("/:id")
  .get(productCategoriesController.findOneById)
  .delete(productCategoriesController.deleteOne)
  .put(
    productCategoriesValidation.updateOne,
    productCategoriesController.updateOne
  );
export const PRODUCT_CATEGORIES_ROUTE = Router;
