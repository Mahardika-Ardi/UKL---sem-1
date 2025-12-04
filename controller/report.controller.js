import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const reportAll = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    const aggrate = await prisma.order_Detail.aggregate({
      _count: true,
      _max: { price: true, quantity: true },
      _min: { price: true, quantity: true },
      _avg: { price: true },
      _sum: { price: true, quantity: true },
      where: {
        createdAt: {
          gte: new Date(start_date),
          lte: new Date(end_date),
        },
      },
    });

    if (!aggrate) {
      return res.status(404).json({
        Message: "Error while loading and counting data",
        Information: [],
      });
    }

    const find = await prisma.order_Detail.findMany({
      take: 3,
      where: { quantity: Number(aggrate._max.quantity) },
      include: {
        orderList: true,
        coffe: true,
      },
    });

    if (!find) {
      return res.status(404).json({
        Message: "Error while loading data",
        Information: [],
      });
    }

    const most_ordered_meal = {};
    find.forEach((item) => {
      most_ordered_meal[item.coffe.name] = { menu_id: Number(item.coffe_id) };
    });
    const most_ordered_size = {};
    find.forEach((item) => {
      most_ordered_size[item.coffe.size] = { menu_id: Number(item.coffe_id) };
    });

    res.status(200).json({
      Message: `Report analysis from ${
        new Date(start_date).toISOString().split("T")[0]
      } to ${new Date(end_date).toISOString().split("T")[0]}`,
      Information: {
        total_order_detail: aggrate._count,
        total_money_overall: Number(aggrate._sum.price),
        total_meal: Number(aggrate._sum.quantity),
        report_satatus_from_order: {
          biggest_money_income: Number(aggrate._max.price),
          smallest_money_income: Number(aggrate._min.price),
          avarage_money_income: parseInt(aggrate._avg.price),
          biggest_quantity_ordered: Number(aggrate._max.quantity),
          smallest_quantity_ordered: Number(aggrate._min.quantity),
        },
        most_ordered_meal,
        most_ordered_size,
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
