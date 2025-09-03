import Router from "express";

import { verifyToken } from "../../../../../shared/Infrastrcuter/middleware/verifyToken.middleware.js";
import { validateRequest } from "../../../../../shared/Infrastrcuter/middleware/validation.middleware.js"

import { pageController } from "../controllers/page.controller.js";

const router = Router();

router.post("/personal/pages", verifyToken, pageController.createPage)

router.post("/workspace/pages", verifyToken, pageController.createTeamPage)

router.patch("/update-page/:pageId", pageController.updatePage)

router.delete("/delete-page/:pageId", pageController.deletePage)

export default router;