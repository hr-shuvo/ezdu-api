import { Router } from "express";
import { loadAcademicSubject } from "../../controllers/acadymy/academyClassController.js";

const router = Router();

// router.get('/', loadAcademicSubjects);

router.get('/', loadAcademicSubject)





export default router;