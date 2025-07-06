import { Router } from "express";
import { getBlogPost, loadBlogPost, upsertBlogPost } from "../../controllers/public/blogController.js";

const router = Router();

router.get('/', loadBlogPost);
router.get('/:id', getBlogPost)
router.post('/upsert', upsertBlogPost)




export default router;