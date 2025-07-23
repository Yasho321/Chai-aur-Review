import express from "express";

import multer from "multer";



import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { getPreRegisteredUser, preRegisterUser, preRegisterUserCSV, preRegisterUserJSON } from "../controllers/user.controllers.js";

const userRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ 1. Pre-register user via form
userRouter.post("/pre-register", requireAuth, requireAdmin, preRegisterUser );

// ✅ 2. Pre-register users via CSV
userRouter.post("/pre-register/csv", requireAuth, requireAdmin, upload.single("csvFile"),preRegisterUserCSV );

// ✅ 3. Pre-register users via JSON
userRouter.post("/pre-register/json", requireAuth, requireAdmin,preRegisterUserJSON );

// ✅ 4. Get all pre-registered users
userRouter.get("/pre-registered", requireAuth, requireAdmin, getPreRegisteredUser);

export default userRouter;
