import { StatusCodes } from "http-status-codes";
import { usersService } from "~/services/usersService";
const createNew = async (req, res, next) => {
  try {
    const createdUser = await usersService.createNew(req.body);

    res.status(StatusCodes.CREATED).json({
      data: createdUser,
      message: "Tạo người dùng thành công!",
    });
  } catch (error) {
    next(error);
  }
};

export const usersController = {
  createNew,
};
