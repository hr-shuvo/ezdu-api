import { Router } from "express";
import {
    getAdmissionCategory,
    loadAdmissionCategory,
    upsertAdmissionCategory
} from "../../controllers/admission/admissionController.js";

const router = Router();

router.get('/', loadAdmissionCategory);
router.get('/:id', getAdmissionCategory)
router.post('/upsert', upsertAdmissionCategory)





export default router;