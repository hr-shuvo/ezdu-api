import { Router } from "express";
import academyClassRoute from "./academy/academyClassRoute.js";
import academySubjectRoute from "./academy/academySubjectRoute.js";
import academyLessonRoute from "./academy/academyLessonRoute.js";
import academyContentRoute from "./academy/academyContentRoute.js";
import academyMcqRoute from "./academy/academyMcqRoute.js";
import academyQuizRoute from "./academy/academyQuizRoute.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const router = Router();

// router.get('/', loadAcademicSubjects);

router.use('/classes', academyClassRoute)
router.use('/subjects', academySubjectRoute)
router.use('/lessons', academyLessonRoute)
router.use('/c', academyContentRoute)
router.use('/mcq', academyMcqRoute)
router.use('/quiz', authenticateUser, academyQuizRoute)



export default router;

