import { Router } from "express";
import {
    loadAcademyQuiz,
    upsertQuiz,
    getAcademyOngoingQuiz,
    loadOrCreateQuiz,
    upsertAcademyQuizXp
} from "../../controllers/academy/academyQuizController.js";


const router = Router();

router.get('/', loadAcademyQuiz);
router.get('/ongoing', getAcademyOngoingQuiz);
router.post('/upsert', upsertQuiz);
router.post('/loadOrCreate', loadOrCreateQuiz);

router.get('/xp', upsertAcademyQuizXp);

export default router;