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
        Message: "failed to add into order list!",
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

export const findOrderList = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const customer_name = req.body.customer_name || req.query.customer_name;

    let where = {};

    if (id) where.id = Number(id);
    if (customer_name) where.customer_name = customer_name;

    if (Object.keys(where).length === 0) {
      return res.status(404).json({
        Message: "Invalid input, data must be filled to search order list!",
        Information: [],
      });
    }

    const find = await prisma.order_List.findMany({
      where,
      include: {
        orderDetails: {
          include: {
            coffe: true,
          },
        },
      },
    });

    if (!find || find.length === 0) {
      const findAll = await prisma.order_List.findMany({
        include: {
          orderDetails: {
            include: {
              coffe: true,
            },
          },
        },
      });
      const result = findAll.map((item) => {
        const resl = {
          customer_name: item.customer_name,
          order_type: item.order_type,
          ordered_at: item.order_date,
          order_details: {
            order_id: item.order_id,
            coffe_id: item.coffe_id,
            coffe: {
              coffe_image: item.coffe.image,
              coffe_name: item.coffe.name,
              coffe_size: item.coffe.size,
              coffe_price: item.coffe.price,
            },
            order: {
              customer_name: item.orderList.customer_name,
              order_type: item.orderList.order_type,
              ordered_at: item.orderList.order_date,
            },
            quantity: item.quantity,
            price: item.coffe.price * item.quantity,
            order_created_at: item.createdAt,
          },
        };
        return resl;
      });
      return res.status(200).json({
        Message: "Can't find that order list, showing all order list instead!",
        Information: result,
      });
    }
    const data = find.map((item) => {
      const result = {
        customer_name: item.customer_name,
        order_type: item.order_type,
        ordered_at: item.order_date,
        order_details: {
          order_id: item.order_id,
          coffe_id: item.coffe_id,
          coffe: {
            coffe_image: item.coffe.image,
            coffe_name: item.coffe.name,
            coffe_size: item.coffe.size,
            coffe_price: item.coffe.price,
          },
          order: {
            customer_name: item.orderList.customer_name,
            order_type: item.orderList.order_type,
            ordered_at: item.orderList.order_date,
          },
          quantity: item.quantity,
          price: item.coffe.price * item.quantity,
          order_created_at: item.createdAt,
        },
      };
      return result;
    });

    res.status(200).json({
      Message: "Successfully find that order list!",
      Information: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};
