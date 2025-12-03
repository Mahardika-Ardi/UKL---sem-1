import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const find = await prisma.users.findUnique({ where: { email } });

    if (find) {
      return res.status(404).json({
        Message: "E - Mail has been used!",
        Information: [],
      });
    }

    const hashed = await bcrypt.hash(password, 12);
     
    const add = await prisma.users.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    if (!add) {
      return res.status(404).json({
        Message: "Failed to add users!",
        Information: [],
      });
    }
    const userSafe = { ...add };
    delete userSafe.password;

    res.status(201).json({
      Message: "Successfully add users!",
      Information: userSafe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;

    const find = await prisma.users.findUnique({ where: { email } });
    if (find) {
      return res.status(404).json({
        Message: "E - Mail has been used!",
        Information: [],
      });
    }

    const hashed = await bcrypt.hash(password, 12);

    const updt = await prisma.users.update({
      where: { id },
      data: {
        name,
        email,
        password: hashed,
      },
    });

    if (!updt) {
      return res.status(404).json({
        Message: "Update failed!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Successfully updated users!",
      Information: updt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const deltUsers = async (req, res) => {
  try {
    const id = req.params.id;

    const delt = await prisma.users.delete({ where: { id } });
    if (!delt) {
      return res.status(404).json({
        Message: "Failed to delete users",
        Information: [],
      });
    }

    const userSafe = { ...delt };
    delete userSafe.password;

    res.status(200).json({
      Message: "Successfully deleting users!",
      Information: userSafe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const find = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const name = req.body.name || req.query.name;
    const email = req.body.email || req.query.email;

    let where = {};

    if (id) where.id = Number(id);
    if (name) where.name = name;
    if (email) where.email = email;

    if (Object.keys(where).length === 0) {
      return res.status(404).json({
        Message: "Invalid input, data must be filled to search users!",
        Information: [],
      });
    }

    const find = await prisma.users.findMany({ where });

    if (!find || find.length === 0) {
      const findAll = await prisma.users.findMany({});
      const userSafe = findAll.map((item) => {
        const result = {
          id: item.id,
          name: item.name,
          email: item.email,
          role: item.role,
          joining_at: item.createdAt,
        };
        return result;
      });
      return res.status(200).json({
        Message: "Can't find that users, showing all users instead!",
        Information: userSafe,
      });
    }
    const user = find.map((index) => {
      const result = {
        id: index.id,
        name: index.name,
        email: index.email,
        role: index.role,
        joining_at: index.createdAt,
      };
      return result;
    });

    res.status(200).json({
      Message: "Successfully find that users!",
      Information: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};
