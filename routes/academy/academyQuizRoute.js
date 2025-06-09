import { Router } from "express";
import { loadAcademyQuiz, upsertQuiz, getAcademyOngoingQuiz, loadOrCreateQuiz } from "../../controllers/academy/academyQuizController.js";


const router = Router();

router.get('/', loadAcademyQuiz);
router.get('/ongoing', getAcademyOngoingQuiz);
router.post('/upsert', upsertQuiz);
router.post('/loadOrCreate', loadOrCreateQuiz);

export default router;