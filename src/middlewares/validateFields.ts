import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('errors', errors);
    res.status(400).json({
      ok: false,
      errors: errors.mapped()
    });
    return;
  }

  next();
};

export {
  validateFields
};

