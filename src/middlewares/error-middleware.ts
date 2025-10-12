import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import ApiError from "../exeptions/api-error";

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors });
    return;
  }

  res.status(500).json({ message: "Непредвиденная ошибка" });
};
