
import { compare, genSalt, hash } from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../helpers";
import { RequestWithUser } from "../middlewares";
import { User } from "../models";
import { IUser } from "../types";

const createUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  const { name, email, password } = req.body;

  try {

    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        ok: false,
        msg: 'Email already exists'
      });
      return;
    }

    user = new User({ name, email, password });

    // Encrypt password
    const salt = await genSalt();

    user.password = await hash(password.toString(), salt);

    await user.save();

    res.json({
      ok: true,
      msg: 'Register success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });
  }
};

const login = async (req: Request<{}, {}, IUser>, res: Response) => {
  const { email, password } = req.body;
  try {

    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        ok: false,
        msg: 'User not found'
      });
      return;
    }

    // Check password

    const validPassword = await compare(password.toString(), user.password);

    if (!validPassword) {
      res.status(400).json({
        ok: false,
        msg: 'Password is incorrect'
      });
      return;
    }

    // Generate JWT
    const token = await generateToken(user);

    res.status(200).json({
      ok: true,
      msg: 'Login success',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });

  }
};

const renewToken = async (req: RequestWithUser, res: Response) => {

  try {
    const { user } = req;
    const token = await generateToken(user as IUser);
    res.json({
      ok: true,
      msg: 'Token renewed',
      user,
      token
    });

  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator'
    });

  }


};

export {
  createUser,
  login,
  renewToken
};

