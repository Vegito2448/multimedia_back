import { createSecretKey } from "crypto";
import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { IUser } from "../types";

export interface ITokenPayload extends Pick<IUser, 'name' | 'id'> {
}

export interface RequestWithUser extends Request {
  user?: ITokenPayload;
}

const validateToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

    const { payload, protectedHeader, ...rest } = await jwtVerify<ITokenPayload>(token, secretKey);
    const { name, id } = payload;
    // Attach payload to request object for further use in other routes
    req.user = { name, id };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      ok: false,
      msg: 'Invalid token'
    });
  }
};

export { validateToken };

