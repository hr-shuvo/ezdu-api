import { Router } from "express";
import {
    getDiscussionPost,
    loadDiscussionPost,
    upsertDiscussionPost
} from "../controllers/discussion/discussionPostController.js";
import { authenticateUser, optionalAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

router.get('/',optionalAuth, loadDiscussionPost);
router.get('/:id', getDiscussionPost);
router.post('/upsert', authenticateUser, upload.single('image'), upsertDiscussionPost);



export default router;