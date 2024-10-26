import { Router } from "express";
import { check } from "express-validator";
import { createUser, login, renewToken } from "../controllers/index.ts";
import { validateFields, validateToken } from "../middlewares/index.ts";

/*
  User Routes /auth
  host + /api/auth
*/

const router = Router();

router.post('/new', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').isLength({ min: 8 }),
  validateFields
], createUser);

router.post('/', [
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').isLength({ min: 8 }),
  validateFields,
], login);

router.get('/renew', validateToken, renewToken);

export default router;