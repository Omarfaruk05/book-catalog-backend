import express from "express";
import auth from "../../middlewares/auth";
import { ENUM_ROLE } from "../../../enums/user";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post(
  "/create-order",
  auth(ENUM_ROLE.CUSTOMER),
  OrderController.createOrder
);
router.get(
  "/",
  auth(ENUM_ROLE.CUSTOMER, ENUM_ROLE.ADMIN),
  OrderController.getAllOrders
);

export const OrderRoutes = router;
