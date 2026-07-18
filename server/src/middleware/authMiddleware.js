import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const auth = asyncHandler((req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    const error = new Error("Unauthenticated user. ");
    error.status = 400;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { id, role } = decoded;

  req.user = { id, role };

  next();
});

export default auth;
