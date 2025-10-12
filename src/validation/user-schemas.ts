import { z } from "zod";
import { UserRole } from "../prisma/generated";

export const registrationSchema = z.object({
  fullName: z.string().min(3).max(50),
  birthDate: z.coerce.date(),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(UserRole),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
