import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { createSecretKey } from "node:crypto";
import process from "node:process";
import { IUser } from "../types/index.ts";

export type ITokenPayload = Pick<IUser, 'name' | 'id' | 'role'>;

export interface RequestWithUser extends Request {
  user?: ITokenPayload;
}

const validateToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {

  const token = req.header('x-token');

  if (!token) {
    res.status(401).json({
      ok: false,
      msg: 'Token is required'
    });
    return;
  }

  try {
    const secretKey = createSecretKey(process.env.JWT_SECRET!, 'utf8');

    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined');
    }

    const { payload } = await jwtVerify<ITokenPayload>(token, secretKey);
    const { name, id, role } = payload;
    // Attach payload to request object for further use in other routes
    req.user = { name, id, role };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      ok: false,
      msg: 'Invalid token'
    });
    return
  }
};

export { validateToken };

