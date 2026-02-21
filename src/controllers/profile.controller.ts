import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.userId;

    if(!idParam || Array.isArray(idParam) ){
      return res.status(201).json({message : "Invalid Id"})
    }
    const userId = parseInt(idParam)
    // Fetch user + wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        holdings: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count total trades
    const totalTrades = await prisma.trade.count({
      where: { userId }
    });

    // Convert BigInt to string for safe JSON response
    const response = {
      id: user.id.toString(),
      email: user.email,
      balance: user.wallet?.balance,
      totalTrades,
      totalHoldings: user.holdings.length,
      createdAt: user.createdAt
    };

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
