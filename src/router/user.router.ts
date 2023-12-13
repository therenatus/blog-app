import express from "express";
import { CreateUserValidator } from "./validator/create-user.validator";
import { InputValidationMiddleware } from "../middleware/inputValidationMiddleware";
import { userController } from "../composition-root";

const router = express.Router();

router.get("/", userController.getUsers.bind(userController));
router.post(
  "/",
  CreateUserValidator,
  InputValidationMiddleware,
  userController.createUser.bind(userController),
);
router.get("/:id", userController.getUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));

export default router;
