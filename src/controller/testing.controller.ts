import express from "express";
import { Test } from "../service/testing.service";

const router = express.Router();
const service = new Test();

router.delete("/all-data", service.deleteAll);

export default router;
