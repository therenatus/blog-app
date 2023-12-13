import { securityController } from "../composition-root";
import express from "express";

const router = express.Router();

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
