import { Router } from "express";
import {
    getAcademicSubject,
    loadAcademicSubject,
    upsertAcademicSubject
} from "../../controllers/academy/academySubjectController.js";

const router = Router();

router.get('/', loadAcademicSubject);
router.get('/:id', getAcademicSubject)
router.post('/upsert', upsertAcademicSubject)


export default router;