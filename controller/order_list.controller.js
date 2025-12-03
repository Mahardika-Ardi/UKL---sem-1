import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addOrderList = async (req, res) => {
  try {
    const { customer_name, order_type, order_date } = req.body;
    const add = await prisma.order_List.create({
      data: {
        customer_name,
        order_type,
        order_date,
      },
    });

      if (!add) {
        return res.status(404).json({
        Message: 'failed to add into order list!',
        Information: [],
        });
      }
    res.status(200).json({
      Message: "Sucessfully added order list!",
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

export const update = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const { customer_name, order_type, order_date } = req.body;

    const updt = await prisma.order_List.update({
      where: { id },
      data: {
        customer_name,
        order_type,
        order_date,
      },
    });

    if (!updt) {
      return res.status(404).json({
        Message: "FAiled to update order list!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Successfully uppdate this order list!",
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
