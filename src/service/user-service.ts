import * as bcrypt from "bcrypt";
import ApiError from "../exeptions/api-error";
import { prisma } from "../prisma/client";
import { UserRole } from "../prisma/generated";
import tokenService from "./token-service";
import UserDto from "../dtos/user-dto";

class UserService {
  async registration(
    fullName: string,
    birthDate: Date,
    email: string,
    password: string,
    role: UserRole,
    userAgent: string
  ) {
    const existedUser = await prisma.user.findUnique({ where: { email } });

    if (existedUser) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const user = await prisma.user.create({
      data: {
        fullName,
        birthDate,
        email,
        password: hashPassword,
        role,
      },
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(BigInt(userDto.id), userAgent, tokens.refresh);

    return { ...tokens, user: userDto };
  }

  async login(email: string, password: string, userAgent: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email не найден`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(BigInt(userDto.id), userAgent, tokens.refresh);

    return { ...tokens, user: userDto };
  }

  async getUserById(
    requesterId: bigint,
    targetUserId: bigint,
    requesterRole: UserRole
  ) {
    const isSelf = requesterId === targetUserId;
    const isAdmin = requesterRole === "admin";

    if (!isSelf && !isAdmin) {
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден");
    }

    return new UserDto(user);
  }

  async getAllUsers(requesterRole: UserRole) {
    if (requesterRole !== "admin") {
      throw ApiError.UnauthorizedError();
    }

    const users = await prisma.user.findMany();
    return users.map((user) => new UserDto(user));
  }

  async blockUser(
    requesterId: bigint,
    targetUserId: bigint,
    requesterRole: UserRole
  ) {
    const isSelf = requesterId === targetUserId;
    const isAdmin = requesterRole === "admin";

    if (!isSelf && !isAdmin) {
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive: false },
    });

    return new UserDto(user);
  }
}

export default new UserService();
