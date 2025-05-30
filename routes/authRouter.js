import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { validateLoginInput, validateRegisterInput } from "../middleware/validationMiddleware.js";


const router = Router();

router.post("/login", validateLoginInput, login);
router.post("/register", validateRegisterInput, register);
router.post("/logout", logout);


export default router;