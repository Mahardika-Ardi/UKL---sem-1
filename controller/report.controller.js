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

    const find = await prisma.order_Detail.findMany({
      take: 3,
      where: { quantity: Number(aggrate._max.quantity) },
      include: {
        orderList: true,
        coffe: true,
      },
    });
    const coffeId = find.map((item) => {
      return item.coffe_id;
    });
    const findCoffe = await prisma.coffe.findMany({
      where: { id: Number(coffeId) },
    });
    const cofNam = findCoffe.map((item) => {
      return item.name;
    });

    const foodResult = find.forEach((item) => {
      return { [cofNam]: Number(coffeId) };
    });

    // const arr = [];
    // arr.push({ [cofNam]: Number(coffeId) });
    res.status(200).json({
      Message: `Report analysis from ${
        new Date(start_date).toISOString().split("T")[0]
      } to ${new Date(end_date).toISOString().split("T")[0]}`,
      Information: {
        total_order_detail: aggrate._count,
        total_money_overall: aggrate._sum.price,
        total_meal: aggrate._sum.quantity,
        report_satatus_from_order: {
          biggest_money_income: aggrate._max.price,
          smallest_money_income: aggrate._min.price,
          avarage_money_income: aggrate._avg.price,
          biggest_quantity_ordered: aggrate._max.quantity,
          smallest_quantity_ordered: aggrate._min.quantity,
        },
        most_ordered_meal: {
          foodResult,
        },
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
