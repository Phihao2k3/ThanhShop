import e from "express";
import { StatusCodes } from "http-status-codes";
import { CartsModel } from "~/models/cartsModel";
import APIError from "~/utils/APIerror";
const addCart = async (data) => {
  try {
    const newCart = {
      ...data,
    };
    const result = await CartsModel.addCart(newCart);
    return result;
  } catch (error) {
    throw error;
  }
};
const deleteCartItem = async (data) => {
  try {
    const result = await CartsModel.deleteCartItem(data);
    return result;
  } catch (error) {
    throw error;
  }
};
const updatequantityCartItem = async (data) => {
  try {
    const result = await CartsModel.updatequantityCartItem(data);
    return result;
  } catch (error) {
    throw error;
  }
};
const getAll = async (data) => {
  try {
    const result = await CartsModel.getAll(data);
    return result;
  } catch (error) {
    throw error;
  }
};
export const cartsService = {
  addCart,
  deleteCartItem,
  updatequantityCartItem,
  getAll,
};
