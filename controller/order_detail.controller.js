import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addOrderDetail = async (req, res) => {
  try {
    const { order_id, coffe_id, quantity } = req.body;

    const findCoffe = await prisma.coffe.findMany({ where: { id: coffe_id } });
    const priceCoffe = findCoffe.map((item) => {
      return item.price;
    });
    const add = await prisma.order_Detail.create({
      data: {
        order_id: Number(order_id),
        coffe_id: Number(coffe_id),
        quantity: Number(quantity),
        price: parseFloat(priceCoffe * quantity),
      },
      include: { orderList: true, coffe: true },
    });

    if (!add) {
      return res.status(404).json({
        Message: "Can't add order detail!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Sucessfully add order detail",
      Information: {
        order_id: add.order_id,
        coffe_id: add.coffe_id,
        coffe: {
          coffe_image: add.coffe.image,
          coffe_name: add.coffe.name,
          coffe_size: add.coffe.size,
          coffe_price: add.coffe.price,
        },
        order: {
          customer_name: add.orderList.customer_name,
          order_type: add.orderList.order_type,
          ordered_at: add.orderList.order_date,
        },
        quantity: add.quantity,
        price: add.price,
        order_created_at: add.createdAt,
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

export const updateOrderDetail = async (req, res) => {
  try {
    const id = req.params.id || req.body.id || req.query.id;
    const { order_id, coffe_id, quantity, price } = req.body;

    const findCoffe = await prisma.coffe.findMany({
      where: { id: coffe_id },
    });
    const priceCoffe = findCoffe.map((item) => {
      return item.price;
    });
    const updt = await prisma.order_Detail.update({
      where: { id },
      data: {
        order_id: Number(order_id),
        coffe_id: Number(coffe_id),
        quantity: Number(quantity),
        price: parseFloat(priceCoffe * quantity),
      },
    });

    if (!updt) {
      return res.status(404).json({
        Message: "failed to update order details!",
        Information: [],
      });
    }

    const find = await prisma.order_Detail.findMany({
      where: { id },
      include: { orderList: true, coffe: true },
    });

    const result = find.map((item) => {
      const resl = {
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
        price: item.price,
        order_created_at: item.createdAt,
      };
      return resl;
    });

    res.status(200).json({
      Message: "Successfully updated order details",
      Information: result,
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
    const order_id = req.body.order_id || req.query.order_id;
    const coffe_id = req.body.coffe_id || req.query.coffe_id;

    let where = {};

    if (id) where.id = Number(id);
    if (order_id) where.order_id = order_id;
    if (coffe_id) where.coffe_id = coffe_id;

    if (Object.keys(where).length === 0) {
      return res.status(404).json({
        Message: "Invalid input, data must be filled to search order details!",
        Information: [],
      });
    }

    const find = await prisma.order_Detail.findMany({
      where,
      include: { orderList: true, coffe: true },
    });

    if (!find || find.length === 0) {
      const findAll = await prisma.order_Detail.findMany({
        include: { orderList: true, coffe: true },
      });
      const result = findAll.map((item) => {
        const resl = {
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
          price: item.price,
          order_created_at: item.createdAt,
        };
        return resl;
      });
      return res.status(200).json({
        Message:
          "Can't find that order details, showing all order details instead!",
        Information: result,
      });
    }
    const data = find.map((item) => {
      const result = {
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
