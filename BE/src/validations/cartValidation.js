import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import APIError from "~/utils/APIerror";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
const addCartValidation = async (req, res, next) => {
  try {
    const correctConditions = Joi.object({
      product_id: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
        .required()
        .messages({
          "string.base": "product_id phải là chuỗi",
          "string.empty": "product_id không được để trống",
          "any.required": "product_id là trường bắt buộc",
        }),

      quantity: Joi.number().min(1).required().messages({
        "number.base": "quantity phải là số",
        "number.empty": "quantity không được để trống",
        "any.required": "quantity là trường bắt buộc",
        "number.min": "quantity phải lớn hơn hoặc bằng 1",
      }),
    }).unknown(true);
    await correctConditions.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const { details } = error;
    const errorObject = details.reduce((acc, { message, path }) => {
      acc[path[0]] = message;
      return acc;
    }, {});
    next(
      new APIError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Dữ liệu không hợp lệ",
        errorObject
      )
    );
  }
};

export const cartValidation = {
  addCartValidation,
};
