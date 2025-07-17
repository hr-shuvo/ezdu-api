import { Router } from "express";
import { getApplicationStatus, getCurrentUserDetails, updateUser } from "../controllers/userController.js";
import { getAcademyProgress } from "../controllers/academy/academyProgressController.js";
import { authenticateUser, authorizePermission, optionalAuth } from "../middleware/authMiddleware.js";
import { validateUpdateUserInput } from "../middleware/validationMiddleware.js";


const router = Router();

router.get("/current-user", authenticateUser, getCurrentUserDetails);
router.put("/update-user", authenticateUser, validateUpdateUserInput, updateUser);
router.get("/admin/app-status", authenticateUser, authorizePermission('admin'), getApplicationStatus);

router.get("/academy/progress", optionalAuth, getAcademyProgress);


export default router;