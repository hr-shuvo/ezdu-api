import { Router } from "express";
import { upsertChallengeProgress } from "../controllers/challengeProgressController.js";

const router = Router();

router.post('/upsert', upsertChallengeProgress);

export default router;