import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import APIError from "~/utils/APIerror";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
const CARTS_COLLECTION = "carts";
const CART_Items_COLLECTION = "cartItems";
const CART_SCHEMA = Joi.object({
  user_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  created_at: Joi.date().timestamp("javascript").default(Date.now()),
}).unknown(false);
const CART_ITEMS_SCHEMA = Joi.object({
  cart_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  product_id: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .required(),
  quantity: Joi.number().min(1).required(),
  created_at: Joi.date().timestamp("javascript").default(Date.now()),
}).unknown(true);

const validateCart = async (data) => {
  return await CART_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateCartItem = async (data) => {
  return await CART_ITEMS_SCHEMA.validateAsync(data, { abortEarly: false });
};

const addCart = async (data) => {
  try {
    // check if user_id exists
    const validCart = await validateCart({ user_id: data.user_id });
    const dataCart = {
      ...validCart,
      user_id: new ObjectId(data.user_id),
    };
    const existCart = await checkexistCart(dataCart);
    if (existCart) {
      //   nếu đã có giỏ hàng thì add item vào giỏ hàng
      // check nếu item đã tồn tại trong giỏ hàng thì tăng số lượng
      const existCartItem = await checkexistCartItem({
        cart_id: existCart._id,
        product_id: new ObjectId(data.product_id),
      });

      if (existCartItem) {
        // update quantity
        const newQuantity =
          Number(existCartItem.quantity) + Number(data.quantity);
        const result = await GET_DB()
          .collection(CART_Items_COLLECTION)
          .updateOne(
            { _id: existCartItem._id },
            { $set: { quantity: newQuantity } }
          );
        return result;
      }
      const cartItem = await validateCartItem({
        cart_id: existCart._id.toString(),
        product_id: data.product_id,
        quantity: data.quantity,
      });
      const dataCartItem = {
        ...cartItem,
        cart_id: new ObjectId(cartItem.cart_id),
        product_id: new ObjectId(cartItem.product_id),
      };

      const result = await GET_DB()
        .collection(CART_Items_COLLECTION)
        .insertOne(dataCartItem);
      return result;
    } else {
      const cart = await GET_DB()
        .collection(CARTS_COLLECTION)
        .insertOne(dataCart);
      const cartItem = await validateCartItem({
        cart_id: cart.insertedId.toString(),
        product_id: data.product_id,
        quantity: data.quantity,
      });
      const result = await GET_DB()
        .collection(CART_Items_COLLECTION)
        .insertOne(cartItem);
      return result;
    }
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};
const checkexistCart = async (data) => {
  try {
    const cart = await GET_DB()
      .collection(CARTS_COLLECTION)
      .findOne({ user_id: data.user_id });
    return cart;
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};
const checkexistCartItem = async (data) => {
  try {
    console.log("data", data);

    const cartItem = await GET_DB()
      .collection(CART_Items_COLLECTION)
      .findOne({ cart_id: data.cart_id, product_id: data.product_id });
    return cartItem;
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};
const deleteCartItem = async (data) => {
  try {
    const result = await GET_DB()
      .collection(CART_Items_COLLECTION)
      .deleteOne({
        _id: new ObjectId(data.id), // ID của cart item
      });

    return result;
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};

const updatequantityCartItem = async (data) => {
  try {
    console.log("data", data);

    const result = await GET_DB()
      .collection(CART_Items_COLLECTION)
      .updateOne(
        {
          _id: new ObjectId(data.id), // ID của cart item
        },
        { $set: { quantity: Number(data.quantity) } }
      );

    return result;
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};
const getAll = async (data) => {
  try {
    const result = await GET_DB()
      .collection(CART_Items_COLLECTION)
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $lookup: {
            from: "carts",
            localField: "cart_id",
            foreignField: "_id",
            as: "cart",
          },
        },
        { $unwind: "$cart" }, // Giải nén mảng `cart`
        {
          $match: {
            "cart.user_id": new ObjectId(data.user_id),
          },
        },
        {
          $project: {
            _id: 1,
            quantity: 1,
            product: { $arrayElemAt: ["$product", 0] }, // Chỉ lấy sản phẩm đầu tiên
            cart: 1,
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};

export const CartsModel = {
  addCart,
  validateCart,
  validateCartItem,
  deleteCartItem,
  updatequantityCartItem,
  getAll,
};
