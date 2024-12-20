import { User } from '../models/users';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({
    where: {
      email,
    },
  });
};
