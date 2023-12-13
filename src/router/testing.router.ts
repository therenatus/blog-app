import express from "express";
import { testingController } from "../composition-root";

const router = express.Router();
console.log("router", testingController.deleteAll.bind(testingController));

router.delete("/all-data", testingController.deleteAll.bind(testingController));

export default router;
