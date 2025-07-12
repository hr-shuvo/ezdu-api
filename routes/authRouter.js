import { Router } from "express";
import { login, logout, register, sendVerificationCode, verificationByCode } from "../controllers/authController.js";
import { getCurrentUser, getUserByUsername } from "../controllers/userController.js";
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js";
import { optionalAuth } from "../middleware/authMiddleware.js";


const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/register", validateRegisterInput, register);
router.post("/logout", logout);
router.get("/user", optionalAuth, getCurrentUser);
router.get("/user/:username", getUserByUsername);


router.get('/sendVerificationCode/:email', sendVerificationCode);
router.post("/verificationByCode/:email", verificationByCode);


export default router;