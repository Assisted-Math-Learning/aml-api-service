import { User } from '../models/users';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({
    where: {
      email,
    },
  });
};

export const getUserByIdentifier = async (identifier: string) => {
  return User.findOne({
    where: {
      identifier,
    },
    raw: true,
  });
};

export const getUsersByIdentifiers = async (identifiers: string[]) => {
  return User.findAll({
    where: {
      identifier: identifiers,
    },
    raw: true,
  });
};
