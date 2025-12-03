import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addCoffe = async (req, res) => {
  try {
    const { name, size, price } = req.body;

    const add = await prisma.coffe.create({
      data: {
        name,
        size,
        price: parseFloat(price),
        image: req.file.filename,
      },
    });

    if (!add) {
      return res.status(404).json({
        Message: "Failed to add coffe to menu!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Successfully created coffe menu!",
      Information: add,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const updateCoffe = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const { name, size, price } = req.body;

    const updt = await prisma.coffe.update({
      where: { id: Number(id) },
      data: {
        name,
        size,
        price: parseFloat(price),
        image: req.file.filename,
      },
    });

    if (!updt) {
      return res.status(404).json({
        Message: "Failed to update this menu!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Successfully update this menu!",
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

export const deltMenu = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;

    const delt = await prisma.coffe.delete({ where: { id: Number(id) } });

    if (!delt) {
      return res.status(404).json({
        Message: "Can't delete this menu!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Successfully delete this menu!",
      Information: delt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const findCoffe = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const name = req.body.name || req.query.name;
    const size = req.body.size || req.query.size;

    let where = {};

    if (id) where.id = Number(id);
    if (name) where.name = name;
    if (size) where.size = size;

    if (Object.keys(where).length === 0) {
      return res.status(404).json({
        Message: "Data invalid, you must input data!",
        Information: [],
      });
    }

    const find = await prisma.coffe.findMany({ where });

    if (!find || find.length === 0) {
      const findAll = await prisma.coffe.findMany({});
      return res.status(200).json({
        Message: "Showing all data because can't find that menu!",
        Information: findAll,
      });
    }

    res.status(200).json({
      Message: "Menu has been found!",
      Information: find,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};
