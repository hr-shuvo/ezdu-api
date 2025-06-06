import { Router } from "express";
import {
    getAcademicLessonContent,
    loadAcademicLessonContent, upsertAcademicLessonContent
} from "../../controllers/academy/academyContentController.js";

const router = Router();

router.get('/', loadAcademicLessonContent);
router.get('/:id', getAcademicLessonContent)
router.post('/upsert', upsertAcademicLessonContent)


export default router;