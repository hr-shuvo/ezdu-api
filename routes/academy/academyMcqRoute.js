import { Router } from "express";
import { getAcademyMcq, loadAcademyMcq, upsertAcademyMcq } from "../../controllers/academy/academyMcqController.js";

const router = Router();


router.get('/', loadAcademyMcq);
router.get('/:id', getAcademyMcq);
router.post('/upsert', upsertAcademyMcq);


export default router;

