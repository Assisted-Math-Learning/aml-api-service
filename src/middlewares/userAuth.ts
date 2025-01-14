import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../services/user';
import { appConfiguration } from '../config';
import lodash from 'lodash';
import { amlError } from '../types/amlError';
import { UserTransformer } from '../transformers/entity/user.transformer';

const { aml_jwt_secret_key } = appConfiguration;

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')?.[1] || '';

  let user;

  if (!token) {
    const code = 'NO_TOKEN_PROVIDED';
    throw amlError(code, 'No Token Provided', 'TOKEN_REQUIRED', 499);
  }

  // Verify the token

  try {
    const decoded = jwt.verify(token, aml_jwt_secret_key) as jwt.JwtPayload;
    const { email } = decoded;
    // Fetch the user by email
    user = await getUserByEmail(email);
  } catch (error) {
    const code = 'INVALID_TOKEN';
    throw amlError(code, 'Invalid Token', 'INVALID_TOKEN', 498);
  }

  if (!user || !user.is_active) {
    const code = 'USER_NOT_FOUND';
    throw amlError(code, 'User Not Found', 'NOT_FOUND', 404);
  }

  // Attach user object to the request
  const transformedUser = new UserTransformer().transform(user);

  lodash.set(req, 'user', transformedUser);

  next();
};
