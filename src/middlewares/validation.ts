import { NextFunction, Response } from 'express';
import { type ITokenPayload, type RequestWithUser } from "./index.ts";

const isAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { role } = req?.user as ITokenPayload;

  if (role !== 'admin' || !role) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }
  next();
};

const hasRoles = (roles: string[]) => (req: RequestWithUser, res: Response, next: NextFunction) => {


  const { role } = req?.user as ITokenPayload;

  if (!roles.includes(role) || !role) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  next();

};

export { hasRoles, isAdmin };

