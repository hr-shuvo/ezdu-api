import { Router } from "express";
import { getApplicationStatus, getCurrentUserDetails, updateUser } from "../controllers/userController.js";
import { getAcademyProgress } from "../controllers/academy/academyProgressController.js";
import { authorizePermission } from "../middleware/authMiddleware.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";


const router = Router();

router.get("/current-user", getCurrentUserDetails);
router.put("/update-user", validateUpdateUserInput, updateUser);
router.get("/admin/app-status", authorizePermission('admin'), getApplicationStatus);

router.get("/academy/progress", getAcademyProgress);


export default router;