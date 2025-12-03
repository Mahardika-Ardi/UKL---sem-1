import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addOrderDetail = async (req, res) => {
  try {
    const { order_id, coffe_id, quantity, price } = req.body;

    const add = await prisma.order_Detail.create({
      data: {
        order_id: Number(order_id), 
        coffe_id: Number(coffe_id),
        quantity: Number(quantity),
        price: parseFloat(price),
      },
    });
      
      if (!add) {
        return res.status(404).json({
        Message: "Can't add order detail!",
        Information: [],
        });
      }

      res.status(200).json({
      Message: 'Sucessfully add order detail',
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

export const updateOrderDetail = async (req, res) => {
  try {
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
    Message: 'Error ->',
    Information: error.message,
    });
  }
}