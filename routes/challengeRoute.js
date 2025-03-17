import { Router } from "express";
import { getChallenge, loadChallenges, createChallenge } from "../controllers/challengeController.js";

const router = Router();



router.get('/', loadChallenges);
router.get('/:id', getChallenge);
router.post('/create', createChallenge); // upsert



export default router;