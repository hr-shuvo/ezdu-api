import { Router } from "express";
import { loadAcademyMcq } from "../../controllers/academy/academyMcqController.js";

const router = Router();


router.get('/', loadAcademyMcq);


export default router;

