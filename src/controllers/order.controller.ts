import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    const { userId, symbol, side, type, price, quantity } = req.body;

    const result = await orderService.handleOrder({
      userId,
      symbol,
      side,
      type,
      price,
      quantity,
    });

    return res.status(200).json(result);

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};