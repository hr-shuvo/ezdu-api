import { Router } from "express";
import { reduceHearts, upsertChallengeProgress } from "../controllers/challengeProgressController.js";

const router = Router();

router.post('/upsert', upsertChallengeProgress);
router.post('/reduceHearts', reduceHearts);

export default router;