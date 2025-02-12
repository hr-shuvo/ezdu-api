import {Router} from 'express';
import { getUserProgress, selectUserCourse } from "../controllers/userProgressController.js";


const router = Router()

router.get('/',  getUserProgress)
router.post('/selectUserCourse',  selectUserCourse)


export default router;