import { Router } from "express";
import academyClassRoute from "./academy/academyClassRoute.js";
import academySubjectRoute from "./academy/academySubjectRoute.js";
import academyLessonRoute from "./academy/academyLessonRoute.js";

const router = Router();

// router.get('/', loadAcademicSubjects);

router.use('/classes', academyClassRoute)
router.use('/subjects', academySubjectRoute)
router.use('/lessons', academyLessonRoute)


export default router;

