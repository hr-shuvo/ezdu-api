import { Router } from "express";
import {
    getAcademicSubject,
    loadAcademicSubject,
    upsertAcademicSubject
} from "../../controllers/acadymy/academySubjectController.js";

const router = Router();

router.get('/', loadAcademicSubject);
router.get('/:id', getAcademicSubject)
router.post('/upsert', upsertAcademicSubject)


export default router;