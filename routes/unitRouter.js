import { Router } from "express";
import { loadUnits } from "../controllers/unitController.js";


const router = Router();



router.get('/', loadUnits);
// router.post('/create', createUnit);



export default router;