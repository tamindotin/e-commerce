import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const auth = asyncHandler((req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    const error = new Error("Unauthenticated user. ");
    error.status = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const { id, role } = decoded;

  req.user = { id, role };

  next();
});

export default auth;
