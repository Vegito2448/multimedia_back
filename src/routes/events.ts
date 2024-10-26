import { Router } from "express";
import { check } from "express-validator";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../controllers/index.ts";
import { isDate } from "../helpers/index.ts";
import { validateFields, validateToken } from "../middlewares/index.ts";

const router = Router();

router.use(validateToken); // All routes below this line will require a token

router.get('/', getEvents);

router.post('/', [
  check('title', 'Title is required').not().isEmpty(),
  check('start', 'Start date is required').custom(isDate),
  check('end', 'End date is required').not().isEmpty(),
  validateFields,
], createEvent);

router.put('/:id', [
  check('title', 'Title is required').not().isEmpty(),
  check('start', 'Start date is required').not().isEmpty(),
  check('end', 'End date is required').not().isEmpty(),
  validateFields,
], updateEvent);

router.delete('/:id', deleteEvent);

export default router;