import { Router } from "express";
import {
    loadUserUnits,
    loadUnits,
    getUnit,
    createUnit
} from "../controllers/unitController.js";


const router = Router();



router.get('/', loadUnits);
router.get('/userUnits', loadUserUnits);

router.get('/:id', getUnit); // can't put above / should be after userUnits
router.post('/create', createUnit);


export default router;