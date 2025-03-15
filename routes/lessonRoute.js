import { Router } from "express";
import { loadLessons, getLesson } from "../controllers/lessonController.js";

const router = Router();



router.get('/', loadLessons);
router.get('/:id', getLesson);
// router.post('/create', createLesson); // upsert



export default router;