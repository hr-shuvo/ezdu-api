import { Router } from "express";
import {
    getAcademicInstitute,
    getAcademicModelTest,
    loadAcademicInstitute,
    loadAcademicModelTest,
    upsertAcademicInstitute,
    upsertAcademicModelTest
} from "../../controllers/academy/academyInstituteController.js";

const router = Router();


router.get('/', loadAcademicInstitute);


// institute
router.get('/institute', loadAcademicInstitute);
router.get('/institute/:id', getAcademicInstitute);
router.post('/institute/upsert', upsertAcademicInstitute);


// modeltest
router.get('/modeltest', loadAcademicModelTest);
router.get('/modeltest/:id', getAcademicModelTest);
router.post('/modeltest/upsert', upsertAcademicModelTest);


export default router;

