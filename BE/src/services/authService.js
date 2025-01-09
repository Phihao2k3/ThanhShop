import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"; // Importing jwt for token creation
import APIError from "~/utils/APIerror";
import { AuthModel } from "~/models/authModel";
import { env } from "~/config/environment";
const login = async (data) => {
  try {
    const loginData = {
      phone: data.phone,
      password: data.password,
    };

    // Verify login credentials
    const result = await AuthModel.login(loginData);

    if (result) {
      // Generate JWT token after successful login
      const token = jwt.sign(
        { userId: result._id, phone: result.phone }, // Payload (user data)
        env.JWT_KEY, // Secret key
        { expiresIn: "12h" } // Token expiration time
      );

      return {
        accessToken: token,
      };
    }

    throw new APIError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  } catch (error) {
    throw new APIError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
      error.errors
    );
  }
};

export const AuthService = {
  login,
};
