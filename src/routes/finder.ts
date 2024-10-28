import { Router } from 'express';
import { searchContent } from "../controllers/index.ts";
import { validateToken } from "../middlewares/index.ts";

const router = Router();

router.use(validateToken);

router.get('/:collection/:term', searchContent);

export default router;