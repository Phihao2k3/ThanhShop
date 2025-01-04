import APIError from "~/utils/APIerror";
import { slugify } from "~/utils/formatters";
import { usersModel } from "~/models/usersModel";
const createNew = async (data) => {
  try {
    // tạo slug từ title
    const newBoard = {
      ...data,
      slug: slugify(data.title),
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
export const usersService = {
  createNew,
};
