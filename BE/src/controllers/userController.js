import { StatusCodes } from "http-status-codes";
import { usersService } from "~/services/usersService";
const createNew = async (req, res, next) => {
  try {
    const createdUser = await usersService.createNew(req.body);

    res.status(StatusCodes.CREATED).json({
      createdUser,
      message: "Tạo người dùng thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    console.log(req.user);
    const users = await usersService.getAll(req.query);
    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        meta: users.meta,
        data: users.data,
      },
      message: "Lấy danh sách người dùng thành công!",
    });
  } catch (error) {
    next(error);
  }
};
const getByid = async (req, res, next) => {
  try {
    const user = await usersService.getByid(req.params.id);

    res.status(StatusCodes.OK).json({
      status: "success",
      data: user,
      message: "Lấy người dùng thành công!",
    });
  } catch (error) {
    next(error);
  }
};
export const usersController = {
  createNew,
  getAll,
  getByid,
};
