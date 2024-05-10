import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getTotalRevenuePerMonth(year) {
  const result = await prisma.transaction.groupBy({
    by: ["date"],
    _sum: {
      amount: true, 
    },
    where: {
      date: {
        gte: new Date(year, 0, 1), 
        lt: new Date(year + 1, 0, 1),
      },
    },
    orderBy: {
      date: "asc", 
    },
  });

  const monthlyRevenue = result.map((entry) => {
    const month = entry.date.getMonth(); 
    return {
      year: year,
      month: month + 1,
      totalRevenue: entry._sum.amount || 0,
    };
  });

  const revenuePerMonth = monthlyRevenue.reduce((acc, revenue) => {
    const monthKey = `${revenue.year}-${revenue.month}`;
    if (!acc[monthKey]) {
      acc[monthKey] = revenue.totalRevenue;
    } else {
      acc[monthKey] += revenue.totalRevenue;
    }
    return acc;
  }, {});

  return revenuePerMonth;
}

console.log(await getTotalRevenuePerMonth(2024));
