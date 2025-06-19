import { Router } from "express";
import { getAcademyMcq, loadAcademyMcq, upsertAcademyMcq } from "../../controllers/academy/academyMcqController.js";
import upload from "../../middleware/multerMiddleware.js"

const router = Router();


router.get('/', loadAcademyMcq);
router.get('/:id', getAcademyMcq);
router.post('/upsert', upload.single('imageData'), upsertAcademyMcq);


export default router;

