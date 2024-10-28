import { Router } from "express";
import { check } from 'express-validator';
import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategory } from "../controllers/index.ts";
import { hasRoles, isAdmin, validateFields, validateToken } from "../middlewares/index.ts";

const allowedRoles = ['admin', 'creator'];

const router = Router();

router.use(validateToken);

router.get('/',
  hasRoles(allowedRoles),
  getCategory
);

router.get('/:id',
  hasRoles(allowedRoles),
  getCategoryById
);

router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
    isAdmin
  ],
  createCategory
);

router.put('/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
    isAdmin
  ],
  updateCategory
);

router.delete('/:id',
  isAdmin,
  deleteCategory
);


export default router;