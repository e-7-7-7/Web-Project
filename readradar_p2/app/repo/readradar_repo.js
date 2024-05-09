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
  static async createTransaction({ userId, bookId, amount }) {
    try {
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
        },
      });
      readRadarRepo.UpdateBook({
        id: bookId,
        quantity: book.quantity - +amount,
      });
      readRadarRepo.UpdateCustomer({
        id: bookId,
        account_Balance: user.account_Balance - totalPrice,
      });
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
}

export default readRadarRepo;