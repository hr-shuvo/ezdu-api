import { Router } from "express";
import { loadUserUnits, loadUnits } from "../controllers/unitController.js";


const router = Router();



router.get('/', loadUnits);
// router.post('/create', createUnit);


router.get('/userUnits', loadUserUnits);

export default router;