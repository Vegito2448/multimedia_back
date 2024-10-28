
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateToken } from "../helpers/index.ts";
import { RequestWithUser, type ITokenPayload } from "../middlewares/index.ts";
import { User } from "../models/index.ts";
import { GenericRecord, IUser } from "../types/index.ts";

type GenericRequest = Request<GenericRecord, GenericRecord, IUser>;

const createUser = async (req: GenericRequest, res: Response) => {
  const { name, email, password, username, role } = req.body;

  try {

    let user = await User.findOne({
      $or: [
        { email },
        { username: String(username).toLowerCase() }
      ]
    });

    if (user) {
      res.status(400).json({
        ok: false,
        msg: 'Email / User Name already exists'
      });
      return;
    }

    user = new User({ name, email, password, username: String(username).toLowerCase(), role });

    // Encrypt password
    const salt = await bcrypt.genSalt();

    user.password = await bcrypt.hash(password.toString(), salt);

    await user.save();

    res.status(201).json({
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
      msg: 'Please talk to the administrator',
      error
    });
  }
};

const login = async (req: GenericRequest, res: Response) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user || user.deletedAt) {
      res.status(400).json({
        ok: false,
        msg: 'User not found'
      });
      return;
    }

    // Check password
    const validPassword = await bcrypt.compare(password.toString(), user.password);

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
      msg: 'Please talk to the administrator',
      error
    });

  }
};

const updateUser = async (req: RequestWithUser, res: Response) => {
  const { id: userLoggedID, role: roleLogged } = req.user as ITokenPayload;

  const { id } = req.params;

  if (roleLogged !== 'admin' && userLoggedID !== id) {
    res.status(401).json({
      ok: false,
      msg: 'You cannot update another user'
    });
    return;
  }

  const { password, email, username, name, role } = req.body;

  try {

    const user = await User.findById(id);

    if (!user || user.deletedAt) {
      res.status(404).json({
        ok: false,
        msg: 'User not found'
      });
      return;
    }

    // Encrypt password
    const salt = await bcrypt.genSalt();

    const newPassword = await bcrypt.hash(password.toString(), salt);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        password: newPassword,
        email,
        username: String(username).toLowerCase(),
        name,
        role,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      ok: true,
      msg: 'User updated',
      user: updatedUser
    });

  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator',
      error
    });

  }

}

const renewToken = async (req: RequestWithUser, res: Response) => {

  try {
    const { user } = req;
    const token = await generateToken(user as IUser);
    res.status(200).json({
      ok: true,
      msg: 'Token renewed',
      user,
      token
    });

  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator',
      error
    });

  }

};

const deleteUser = async (req: Request, res: Response) => {

  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      ok: false,
      msg: 'ID is required'
    });
    return;
  }

  try {

    const user = await User.findById(id);

    if (!user || user.deletedAt) {
      res.status(404).json({
        ok: false,
        msg: 'User not found'
      });
      return;
    }

    const deletedUser = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    );


    res.status(
      200
    ).json({
      ok: true,
      msg: 'User deleted',
      user: deletedUser
    });

  } catch (error) {

    console.error('error', error);

    res.status(500).json({
      ok: false,
      msg: 'Please talk to the administrator',
      error
    });

  }
}

export {
  createUser,
  deleteUser,
  login,
  renewToken,
  updateUser
};

