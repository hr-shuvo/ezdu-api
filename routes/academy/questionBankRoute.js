import { Router } from "express";
import { getAcademicInstitute, loadAcademicInstitute, upsertAcademicInstitute } from "../../controllers/academy/instituteController.js";

const router = Router();


router.get('/', loadAcademicInstitute);


// institute
router.get('/institute', loadAcademicInstitute);
router.get('/institute/:id', getAcademicInstitute);
router.post('/institute/upsert', upsertAcademicInstitute);


export default router;

