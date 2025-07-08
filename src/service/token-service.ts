import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { prisma } from "../prisma/client";
import { UserRole } from "../prisma/generated";

config();

export type JwtPayload = {
  id: bigint;
  fullName: string;
  birthDate: Date;
  email: string;
  role: UserRole;
  isActive: boolean;
};

class TokenService {
  generateTokens(payload: JwtPayload) {
    const access = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "30d",
    });
    return {
      access,
      refresh,
    };
  }

  validateAccessToken(token: string): JwtPayload | null {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      ) as JwtPayload;
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: bigint, userAgent: string, refresh: string) {
    const tokenData = await prisma.token.findFirst({
      where: { userId, userAgent },
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (tokenData) {
      const updatedTokenData = await prisma.token.update({
        where: { userId_userAgent: { userId, userAgent } },
        data: { refresh, expiresAt },
      });
      return updatedTokenData;
    }

    const token = await prisma.token.create({
      data: { userId, userAgent, refresh, expiresAt },
    });
    return token;
  }

  async removeToken(refresh: string) {
    const tokenData = await prisma.token.deleteMany({ where: { refresh } });
    return tokenData;
  }

  async findToken(refresh: string) {
    const tokenData = await prisma.token.findUnique({ where: { refresh } });
    return tokenData;
  }
}

export default new TokenService();
