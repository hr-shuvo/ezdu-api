import { Router } from "express";
import { createCourse, loadCourses } from "../controllers/courseController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";


const router = Router();



router.get('/', loadCourses);
router.post('/create', authenticateUser, createCourse);



export default router;