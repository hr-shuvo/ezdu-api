import { Router } from "express";
import { getBlogPost, loadBlogPost, upsertBlogPost } from "../../controllers/public/blogController.js";
import upload from "../../middleware/multerMiddleware.js";

const router = Router();

router.get('/', loadBlogPost);
router.get('/:id', getBlogPost)
router.post('/upsert', upload.single('coverImage'), upsertBlogPost)




export default router;