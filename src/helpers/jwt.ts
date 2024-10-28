import { SignJWT } from "jose";
import { createSecretKey } from "node:crypto";
import process from "node:process";
import { IUser } from "../types/index.ts";

const generateToken = async ({ id, name, role }: IUser) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const secretKey = createSecretKey(secret, 'utf8');
    const payload = { id, name, role };

    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secretKey);

    return token;
  } catch (error) {
    const err = error as Error;

    console.error('error', err?.message, err?.stack);

    throw new Error('Error at token generation: ' + err?.message);
  }
};

export { generateToken };

