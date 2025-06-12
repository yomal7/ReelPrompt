import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../errors/ErrorResponse.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new ErrorResponse("Not authorized", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    throw new ErrorResponse("Invalid token", 401);
  }
});
