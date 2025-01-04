import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
const USERS_COLLECTION__NAME = "users";
const USERS_COLLECTION__SCHEMA = Joi.object({
  user_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .messages({ OBJECT_ID_RULE_MESSAGE }),
  title: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});
const createNew = async (data) => {
  try {
    const createUsers = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .insertOne(data);
    return createUsers;
  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (id) => {
  try {
    const user = await GET_DB()
      .collection(USERS_COLLECTION__NAME)
      .findOne({ _id: id });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
export const usersModel = {
  USERS_COLLECTION__NAME,
  USERS_COLLECTION__SCHEMA,
  createNew,
  findOneById,
};
