import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub?: string;
    id?: string;
    email: string;
    role: string;
  };
}
