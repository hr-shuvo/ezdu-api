import { Router } from "express";
import {
    getAdmissionCategory,
    loadAdmissionCategory,
    upsertAdmissionCategory,
    loadAdmissionCategoryUnit,
    getAdmissionCategoryUnit,
    upsertAdmissionCategoryUnit
} from "../../controllers/admission/admissionController.js";

const router = Router();



router.get('/units/', loadAdmissionCategoryUnit);
router.get('/units/:id', getAdmissionCategoryUnit)
router.post('/units/upsert', upsertAdmissionCategoryUnit)




router.get('/', loadAdmissionCategory);
router.get('/:id', getAdmissionCategory)
router.post('/upsert', upsertAdmissionCategory)



export default router;