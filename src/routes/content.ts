import { Router } from "express";
import { check } from 'express-validator';
import { createContent, deleteContent, getContent, getContentById, updateContent } from "../controllers/index.ts";
import { hasRoles, isAdmin, upload, validateFields, validateToken, verifyUploadPermissions } from '../middlewares/index.ts';

const allowedRoles = ['admin', 'creator', 'reader'];

const router = Router();

router.use(validateToken);

router.get('/',
  hasRoles(allowedRoles),
  getContent
);

router.get('/:id',
  hasRoles(allowedRoles),
  getContentById
);

router.post('/',
  [
    hasRoles([
      'admin', 'creator'
    ]),
    upload.single('file'),
    check('title', 'title is required').not().isEmpty(),
    check('category', 'Category is required').isMongoId(),
    check('topic', 'Topic is required').isMongoId(),
    check('createdBy', 'Created by is required').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields,
    verifyUploadPermissions
  ],
  createContent
);

router.put('/:id',
  [
    hasRoles([
      'admin', 'creator'
    ]),
    upload.single('file'),
    check('title', 'title is required').not().isEmpty(),
    check('category', 'Category is required').isMongoId(),
    check('topic', 'Topic is required').isMongoId(),
    check('description', 'Description is required').not().isEmpty(),
    validateFields,
    verifyUploadPermissions
  ],
  updateContent
);

router.delete('/:id',
  isAdmin,
  deleteContent
);


export default router;