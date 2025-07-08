import { User, UserRole } from "../prisma/generated";

class UserDto {
  readonly id: string;
  readonly fullName: string;
  readonly birthDate: Date;
  readonly email: string;
  readonly role: UserRole;
  readonly isActive: boolean;

  constructor(user: User) {
    this.id = String(user.id);
    this.fullName = user.fullName;
    this.birthDate = user.birthDate;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
  }
}

export default UserDto;
