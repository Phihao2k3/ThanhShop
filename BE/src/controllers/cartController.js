import APIError from "~/utils/APIerror";
import { cartsService } from "~/services/cartsService";
import { StatusCodes } from "http-status-codes";
const addCart = async (req, res, next) => {
  try {
    const newCart = {
      ...req.body,
      user_id: req.user.userId,
    };
    const addCart = await cartsService.addCart(newCart);
    res
      .status(StatusCodes.OK)
      .json({ data: addCart, message: "Thêm giỏ hàng thành công!" });
  } catch (error) {
    next(error);
  }
};
const deleteCartItem = async (req, res, next) => {
  try {
    const dataDelete = {
      ...req.body,
      id: req.params.idCartItem,
    };
    const deleteCartItem = await cartsService.deleteCartItem(dataDelete);
    res
      .status(StatusCodes.OK)
      .json({ data: deleteCartItem, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    next(error);
  }
};
const updatequantityCartItem = async (req, res, next) => {
  try {
    const dataUpdate = {
      ...req.body,
      id: req.params.idCartItem,
      user_id: req.user.userId,
    };
    const updatequantityCartItem = await cartsService.updatequantityCartItem(
      dataUpdate
    );
    res.status(StatusCodes.OK).json({
      data: updatequantityCartItem,
      message: "Cập nhật số lượng thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const data = {
      user_id: req.user.userId,
    };
    const result = await cartsService.getAll(data);
    res.status(StatusCodes.OK).json({ data: result });
  } catch (error) {
    next(error);
  }
};
export const CartController = {
  addCart,
  deleteCartItem,
  updatequantityCartItem,
  getAll,
};
