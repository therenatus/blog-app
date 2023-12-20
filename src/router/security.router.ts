import { container } from "../composition-root";
import express from "express";
import { SecurityController } from "../controller/security.controller";

const router = express.Router();
const securityController = container.resolve(SecurityController);

router.get("/", securityController.getSessions.bind(securityController));
router.delete(
  "/",
  securityController.deleteAllSessions.bind(securityController),
);
router.delete(
  "/:id",
  securityController.deleteSession.bind(securityController),
);

export default router;
