import {Router} from 'express';
import {
    getCourseProgress,
    getLesson, getLessonPercentage,
    getUserProgress,
    selectUserCourse
} from "../controllers/userProgressController.js";


const router = Router()

router.get('/',  getUserProgress)
router.get('/courseProgress',  getCourseProgress)
router.get('/getLesson',  getLesson)
router.get('/getLessonPercentage',  getLessonPercentage)


router.post('/selectUserCourse',  selectUserCourse)


export default router;