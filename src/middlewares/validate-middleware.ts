import { Request, Response, NextFunction } from "express";
import { ZodType, z } from "zod";
import ApiError from "../exeptions/api-error";

export const validateMiddleware =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = z.treeifyError(result.error);
      return next(ApiError.BadRequest("Data validation error", errors));
    }

    req.body = result.data;
    next();
  };
