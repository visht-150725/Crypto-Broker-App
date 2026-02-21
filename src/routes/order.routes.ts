import { Router } from "express";
import { placeOrder } from "../controllers/order.controller";

const orderRoutes = Router();

orderRoutes.post("/",placeOrder);

export default orderRoutes;