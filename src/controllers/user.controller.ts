import { Request, Response } from "express";
import { prisma } from "../config/prisma";

// REGISTER USER

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        wallet: {
          create: {
            balance: 1000000
          }
        }
      },
      include: {
        wallet: true
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------
// LOGIN USER
// --------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user.id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET USER BY ID

export const getUserById = async (req: Request, res: Response) => {
  try {
        const idParam = req.params.id;

        if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ message: "Invalid ID" });
        }



    const user = await prisma.user.findUnique({
      where: { id : Number(idParam) },
      include: {
        wallet: true,
        holdings: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
