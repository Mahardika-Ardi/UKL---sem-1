import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const find = await prisma.users.findUnique({ where: { email } });

    if (!find) {
      return res.status(404).json({
        Message: "E - Mail not found!!",
        Information: [],
      });
    }

    const match = await bcrypt.compare(password, find.password);

    if (!match) {
      return res.status(404).json({
        Message: "Wrong password!",
        Information: [],
      });
    }

    const payload = {
      id: find.id,
      name: find.name,
      email: find.email,
      role: find.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({
      Message: "Successfully Log In!",
      Information: {
        status: true,
        token,
        payload,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const Authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);

      if (!verifiedUser) {
        res.json({
          succes: false,
          auth: false,
          message: "cannot permission to acces",
        });
      } else {
        const user = Array.isArray(verifiedUser)
          ? verifiedUser[0]
          : verifiedUser;
        req.users = user;
        next();
      }
    } else {
      res.json({
        succes: false,
        message: "can't permission access",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};
