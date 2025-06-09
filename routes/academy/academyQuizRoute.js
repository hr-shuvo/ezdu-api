import { Router } from "express";
import { loadAcademyQuiz, upsertQuiz, getAcademyOngoingQuiz } from "../../controllers/academy/academyQuizController.js";


const router = Router();

router.get('/', loadAcademyQuiz);
router.get('/ongoing', getAcademyOngoingQuiz);
router.post('/upsert', upsertQuiz);

export default router;