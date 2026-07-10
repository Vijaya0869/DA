import { User } from '../entities/user.entity';

export class UserViewModel {
  id: string;
  email: string;
  fullName: string;
  picture?: string;

  static fromEntity(user: User): UserViewModel {
    return {
      id: user.id,
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      picture: user.picture,
    };
  }
}
