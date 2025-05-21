import { Router } from "express";
import academyClassRoute from "./academy/academyClassRoute.js";

const router = Router();

// router.get('/', loadAcademicSubjects);

router.use('/classes', academyClassRoute)


export default router;

