import { Router } from "express";
import {
    getAcademicLesson,
    loadAcademicLesson,
    upsertAcademicLesson
} from "../../controllers/academy/academyLessonController.js";

const router = Router();

router.get('/', loadAcademicLesson);
router.get('/:id', getAcademicLesson)
router.post('/upsert', upsertAcademicLesson)


export default router;