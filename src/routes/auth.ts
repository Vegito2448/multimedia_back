import { Router } from "express";
import { check } from "express-validator";
import { createUser, deleteUser, login, renewToken, updateUser } from "../controllers/index.ts";
import { isAdmin, validateFields, validateToken } from "../middlewares/index.ts";

/*
  User Routes /auth
  host + /api/auth
*/

const router = Router();

router.post('/new', [
  check('name', 'Name is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').isLength({ min: 8 }),
  validateFields
], createUser);

router.post('/', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').isLength({ min: 8 }),
  validateFields,
], login);

router.put('/:id', [
  check('role', 'Role is required').isIn(['admin', 'creator', 'reader']),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  validateFields,
  validateToken
], updateUser);

router.delete('/:id',
  validateToken,
  isAdmin,
  deleteUser);

router.get('/renew', validateToken, renewToken);

export default router;