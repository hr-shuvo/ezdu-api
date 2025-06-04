import { Router } from "express";
import {
    getAcademicClass,
    loadAcademicClass,
    upsertAcademicClass
} from "../../controllers/academy/academyClassController.js";

const router = Router();

router.get('/', loadAcademicClass);
router.get('/:id', getAcademicClass)
router.post('/upsert', upsertAcademicClass)





export default router;