import { Router } from "express";
import {
    getDiscussionPost, loadDiscussionComment,
    loadDiscussionPost, upsertDiscussionComment,
    upsertDiscussionPost
} from "../controllers/discussion/discussionPostController.js";
import { authenticateUser, optionalAuth } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js";

const router = Router();

// Discussion Post Routes
router.get('/posts/',optionalAuth, loadDiscussionPost);
router.get('/posts/:id', getDiscussionPost);
router.post('/posts/upsert', authenticateUser, upload.single('image'), upsertDiscussionPost);

// Discussion Comment Routes
router.get('/comments',optionalAuth, loadDiscussionComment);
router.get('/comments/:id', getDiscussionPost);
router.post('/comments/upsert', authenticateUser, upload.single('image'), upsertDiscussionComment);


export default router;