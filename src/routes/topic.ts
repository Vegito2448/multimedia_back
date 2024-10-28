import { Router } from "express";
import { check } from 'express-validator';
import { createTopic, deleteTopic, getTopic, getTopicById, updateTopic } from "../controllers/index.ts";
import { hasRoles, isAdmin, topicValidation, validateFields, validateToken } from "../middlewares/index.ts";

const allowedRoles = ['admin', 'creator'];

const router = Router();

router.use(validateToken);

router.get('/',
  hasRoles(allowedRoles),
  getTopic
);

router.get('/:id',
  hasRoles(allowedRoles),
  getTopicById
);

router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('permissions', 'Permissions is required').custom(topicValidation),
    validateFields,
    isAdmin

  ],
  createTopic
);

router.put('/:id',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('permissions').custom(topicValidation),
    validateFields,
    isAdmin

  ],
  updateTopic
);

router.delete('/:id',
  isAdmin,
  deleteTopic
);


export default router;