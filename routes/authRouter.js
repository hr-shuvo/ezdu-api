import { Router } from "express";
import { login, logout, register, sendVerificationCode } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/userController.js";
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js";
import { optionalAuth } from "../middleware/authMiddleware.js";


const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/register", validateRegisterInput, register);
router.post("/logout", logout);
router.get("/user", optionalAuth, getCurrentUser);


router.get('/sendVerificationCode/:email', sendVerificationCode)



export default router;