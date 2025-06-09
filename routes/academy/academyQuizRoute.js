import { Router } from "express";
import { loadAcademyQuiz, upsertQuiz } from "../../controllers/academy/academyQuizController.js";


const router = Router();

router.get('/', loadAcademyQuiz);
router.post('/upsert', upsertQuiz);

export default router;