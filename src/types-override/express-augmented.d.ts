import { Learner } from '../models/learner';
import { User } from '../models/users';

declare module 'express' {
  export interface Request {
    learner?: Learner;
    user?: User;
  }
}
