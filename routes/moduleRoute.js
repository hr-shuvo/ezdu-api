import { loadModules, createModule, getModule } from "../controllers/modulesControlles.js";
import { Router } from "express";

const router = Router();



router.get('/', loadModules);
router.get('/:id', getModule);
router.post('/create', createModule); // upsert



export default router;