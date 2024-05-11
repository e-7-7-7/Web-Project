import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class readRadarRepo {

  static async getUser(where) {
    try {
      const user = await prisma.user.findUnique({
        where: where,
        include: {
          admins: true,
          sellers: true,
          customers: { include: { shipping_address: true } },
        },
      });
      if (!user) {
        throw new Error("not found the user");
      } else {
        if (user.admins.length) {
          user.role = "Admin";
        } else if (user.sellers.length) {
          user.role = "Seller";
        } else if (user.customers.length) {
          user.role = "Customer";
          user.customerId = user.customers[0].id;
          user.account_Balance = user.customers[0].account_Balance;
          if (user.customers[0].shipping_address.length) {
            user.shipping_address = user.customers[0].shipping_address[0];
          }
        }
      }
      await prisma.$disconnect();
      return user;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async getSeller(id){
    try {
      return prisma.seller.findFirst({
        where:{id}
      })
    } catch (error) {
      return {error:error.message}
    }
  }

  static async Login({ username, password }) {
    try {
      return await readRadarRepo.getUser({ username, password });
    } catch (error) {
      if (error.message === "not found the user") {
        throw new Error("invalid username or password");
      }
      throw error;
    }
  }

  static async getBooks(where = {}, addtion_include = {}) {
    console.log("addtion_include", addtion_include);
    try {
      const books = await prisma.book.findMany({
        where: where,
        include: {
          Seller: {
            include: {
              User: {
                select: {
                  id: true,
                  username: true,
                  firstname: true,
                  surname: true,
                },
              },
            },
          },
          ...addtion_include,
        },
      });
      await prisma.$disconnect();
      return books;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async createBook(info) {
    try {
      const book = await prisma.book.create({
        data: info,
      });
      await prisma.$disconnect();
      return book;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async UpdateBook(info) {
    try {
      const book = await prisma.book.update({
        where: { id: info.id },
        data: info,
      });
      await prisma.$disconnect();
      return book;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async UpdateCustomer(info) {
    try {
      const book = await prisma.customer.update({
        where: { id: info.id },
        data: info,
      });
      await prisma.$disconnect();
      return book;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async updateSeller(info) {
    try {
      const seller = await prisma.seller.update({
        where: { id: info.id },
        data: info,
      });
      await prisma.$disconnect();
      return seller;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async updateAddress(info){
    try {
      const address = await prisma.shipping_Address.update({
        where: { id: info.id },
        data: info
      });
      await prisma.$disconnect();
      return address;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async deleteBook(id) {
    try {
      const book = await prisma.book.delete({
        where: { id: id },
      });
      await prisma.$disconnect();
      return book;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async createTransaction({ userId, bookId, amount,sellerId,city }) {
    try {
      const s = await readRadarRepo.getSeller( sellerId );
      const user = await readRadarRepo.getUser({ id: userId });
      if (user.customerId === undefined) {
        throw new Error("this account not a customer user");
      }
      const books = await readRadarRepo.getBooks({ id: +bookId });
      if (books.length === 0) {
        throw new Error("invalid bookId");
      }
      const book = books[0];
      if (book.quantity < +amount) {
        throw new Error("not enough books to buy");
      }
      const totalPrice = book.price * +amount;
      if (user.account_Balance < totalPrice) {
        throw new Error("not enough money to buy");
      }

      const transaction = prisma.transaction.create({
        data: {
          amount: +amount,
          date: new Date().toISOString(),
          customerId: user.customerId,
          bookId: bookId,
          city:city
        },
      });
      await readRadarRepo.UpdateBook({
        id: bookId,
        quantity: book.quantity - +amount,
      });
      await readRadarRepo.UpdateCustomer({
        id: user.customerId,
        account_Balance: user.account_Balance - totalPrice,
      });
      s.account_Balance+= totalPrice
      await readRadarRepo.updateSeller(s)

      return transaction;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  static async getTransaction(where) {
    try {
      const books = await prisma.transaction.findMany({
        where: where,
        include: {
          Book: {
            include: {
              Seller: {
                include: {
                  User: {
                    select: {
                      id: true,
                      username: true,
                      firstname: true,
                      surname: true,
                    },
                  },
                },
              },
            },
          },
          Customer: { include: { shipping_address: true } },
        },
      });
      await prisma.$disconnect();
      return books;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

  static async getTopBooksBySales() {
    //--
    const result = await prisma.transaction.groupBy({
      by: ["bookId"],
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      _sum: {
        amount: true,
      },
      take: 4,
    });
    return result;
  }

  static async getAverageQuantitySoldPerBook() {
    const result = await prisma.transaction.groupBy({
      by: ["bookId"],
      _avg: {
        amount: true,
      },
    });
    return result;
  }

  static async getAveragePurchaseAmountPerBuyer() {
    const result = await prisma.transaction.groupBy({
      by: ["customerId"],
      _avg: {
        amount: true,
      },
    });
    return result;
  }

  static async countTransactionsPerSeller() {
    const sellersWithTransactionCount = await prisma.seller.findMany({
      select: {
        id: true,
        User: {
          select: {
            username: true,
          },
        },
        books: {
          select: {
            transactions: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    const result = sellersWithTransactionCount.map((seller) => ({
      sellerId: seller.id,
      username: seller.User.username,
      transactionCount: seller.books.reduce(
        (acc, book) => acc + book.transactions.length,
        0
      ),
    }));
    return result;
  }

  static async getTotalRevenuePerMonth(year) {
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


  static async getSellerCount() {
    try {
      const sellerCount = await prisma.seller.count();
      await prisma.$disconnect();
      return sellerCount;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }
  
  static async getCustomerCount() {
    try {
      const customerCount = await prisma.customer.count();
      await prisma.$disconnect();
      return customerCount;
    } catch (error) {
      await prisma.$disconnect();
      throw error;
    }
  }

}



export default readRadarRepo;

// const repo = new readRadarRepo();
//  const info ={
//     id: 2,
//     country: 'Qatar',
//     city: 'Alkhor',
//     street: '554',
//     house_number: '9',
//     customerId: 2
//   }

// const addresses = await repo.updateAddress(info)
// console.log(addresses);

// const seller1 = await readRadarRepo.getUser({id:"clw1c57mx0001h632z8wvnai1"})
// console.log(seller1);

// const seller = await readRadarRepo.getSeller(4)
// console.log(seller);

// seller.account_Balance=6000;
// console.log(seller);

// const seller3 = await readRadarRepo.UpdateSeller(seller)
// console.log(seller3);




