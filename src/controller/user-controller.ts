import { Request, Response, NextFunction } from "express";
import { UserRole } from "../prisma/generated";
import userService from "../service/user-service";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, birthDate, email, password, role } = req.body;
      const userAgent = req.headers["user-agent"] || "unknown";

      const data = await userService.registration(
        fullName,
        new Date(birthDate),
        email,
        password,
        role as UserRole,
        userAgent
      );

      res.cookie("refreshToken", data.refresh, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers["user-agent"] || "unknown";

      const data = await userService.login(email, password, userAgent);
      res.cookie("refreshToken", data.refresh, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = BigInt((req as any).user.id);
      const requesterRole = (req as any).user.role as UserRole;
      const targetUserId = BigInt(req.params.id);

      const user = await userService.getUserById(
        requesterId,
        targetUserId,
        requesterRole
      );

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterRole = (req as any).user.role as UserRole;
      const users = await userService.getAllUsers(requesterRole);
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = BigInt((req as any).user.id);
      const requesterRole = (req as any).user.role as UserRole;
      const targetUserId = BigInt(req.params.id);

      const user = await userService.blockUser(
        requesterId,
        targetUserId,
        requesterRole
      );

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
