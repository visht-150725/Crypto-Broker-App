import { prisma } from "../config/prisma";
import { getLatestPrice } from "./binance.service";

interface OrderInput {
  userId: number;
  symbol: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT";
  price?: number;
  quantity: number;
}

export const handleOrder = async (data: OrderInput) => {

  switch (data.type) {

    case "MARKET":
      return handleMarketOrder(data);

    case "LIMIT":
      return handleLimitOrder(data);

    default:
      throw new Error("Invalid order type");
  }
};

const handleMarketOrder = async (data: OrderInput) => {

  const latestPrice = getLatestPrice();

  switch (data.side) {

    case "BUY":
      return executeBuy(data, latestPrice);

    case "SELL":
      return executeSell(data, latestPrice);

    default:
      throw new Error("Invalid order side");
  }
};
const handleLimitOrder = async (data: OrderInput) => {

  if (!data.price) {
    throw new Error("Limit order requires price");
  }

  const order = await prisma.order.create({
    data: {
      userId: data.userId,
      symbol: data.symbol,
      side: data.side === "BUY" ? 1 : 2,
      type: 2, // LIMIT
      price: data.price,
      quantity: data.quantity,
      status: 1 // OPEN
    }
  });

  return { message: "Limit order placed", order };
};

const executeBuy = async (data: OrderInput, executionPrice: number) => {

  const totalCost = executionPrice * data.quantity;

  return await prisma.$transaction(async (tx) => {

    const wallet = await tx.wallet.findUnique({
      where: { userId: data.userId }
    });

    if (!wallet || Number(wallet.balance) < totalCost) {
      throw new Error("Insufficient balance");
    }

    await tx.wallet.update({
      where: { userId: data.userId },
      data: {
        balance: {
          decrement: totalCost
        }
      }
    });

    await tx.trade.create({
      data: {
        userId: data.userId,
        symbol: data.symbol,
        side: 1,
        price: executionPrice,
        quantity: data.quantity
      }
    });

    return { message: "Buy order executed", price: executionPrice };
  });
};

const executeSell = async (data: OrderInput, executionPrice: number) => {

  const totalReceive = executionPrice * data.quantity;

  return await prisma.$transaction(async (tx) => {

    // You should check holdings here

    await tx.wallet.update({
      where: { userId: data.userId },
      data: {
        balance: {
          increment: totalReceive
        }
      }
    });

    await tx.trade.create({
      data: {
        userId: data.userId,
        symbol: data.symbol,
        side: 2,
        price: executionPrice,
        quantity: data.quantity
      }
    });

    return { message: "Sell order executed", price: executionPrice };
  });
};