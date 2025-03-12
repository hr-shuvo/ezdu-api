import { Router } from "express";
import { loadUserUnits } from "../controllers/unitController.js";


const router = Router();



// router.get('/', loadUserUnits);
router.get('/userUnits', loadUserUnits);
// router.post('/create', createUnit);



export default router;