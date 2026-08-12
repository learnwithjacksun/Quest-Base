import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectsRoutes from "./projects.routes.js";
import formsRoutes from "./forms.routes.js";
import otpRoutes from "./otp.routes.js";
import submissionsRoutes from "./submissions.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "OK" });
});

router.use("/auth", authRoutes);
router.use("/projects", projectsRoutes);
router.use("/forms", formsRoutes);
router.use("/otps", otpRoutes);
router.use("/submissions", submissionsRoutes);

export default router;
