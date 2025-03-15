import { Router } from "express";
import { getChallenge, loadChallenges } from "../controllers/challengeController.js";

const router = Router();



router.get('/', loadChallenges);
router.get('/:id', getChallenge);
// router.post('/create', createLesson); // upsert



export default router;