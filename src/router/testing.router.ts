import express from "express";
import { container } from "../composition-root";
import { TestingController } from "../controller/testing.controller";

const router = express.Router();
const testingController = container.resolve(TestingController);

router.delete("/all-data", testingController.deleteAll.bind(testingController));

export default router;
