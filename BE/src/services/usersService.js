import APIError from "~/utils/APIerror";
import { slugify } from "~/utils/formatters";
import { usersModel } from "~/models/usersModel";
import { hashPassword } from "~/utils/hashPassword";
const createNew = async (data) => {
  try {
    // tạo slug từ title
    data.password = await hashPassword(data.password);
    const newBoard = {
      ...data,
    };
    // tạo bản ghi mới trong db
    const createdUsers = await usersModel.createNew(newBoard);
    // lấy bản ghi vừa tạo ra để trả về cho controller
    const getNewUsers = await usersModel.findOneById(createdUsers.insertedId);
    return getNewUsers;
  } catch (error) {
    throw error;
  }
};
const getAll = async (query) => {
  try {
    
    
    const users = await usersModel.getAll(query);
    return users;
  } catch (error) {
    throw error;
  }
};
const getByid = async (id) => {
  try {
   

    const user = await usersModel.findOneById(id);
    if (!user) {
      throw new APIError(404, "Không tìm thấy người dùng!");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
export const usersService = {
  createNew,
  getAll,
  getByid,
};
