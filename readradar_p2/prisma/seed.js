import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const dataUsers = [
  {
    username: "customer1",
    password: "password123",
    name: "Salem",
    surname: "Al hajiri",
    shipping_address: {
      country: "Qatar",
      city: "Alwakrah",
      street: "853",
      house_number: "17",
    },
    id: 1,
    role: "Customer",
    account_Balance: 2000,
  },

  {
    username: "seller1",
    password: "password123",
    name: "Book Seller 1",
    id: 2,
    role: "Seller",
    account_Balance: 0,
  },

  {
    username: "admin1",
    password: "password123",
    name: "Admin 1",
    id: 3,
    role: "Admin",
    account_Balance: 0,
  },

  {
    username: "customer2",
    password: "password123",
    name: "Nasser",
    surname: "Al minahli",
    shipping_address: {
      country: "Qatar",
      city: "Alkhor",
      street: "554",
      house_number: "9",
    },
    id: 4,
    role: "Customer",
    account_Balance: 50,
  },

  {
    username: "seller2",
    password: "password123",
    name: "Book Seller 2",
    id: 5,
    role: "Seller",
    account_Balance: 100,
  },

  {
    username: "admin2",
    password: "password123",
    name: "Admin 2",
    id: 6,
    role: "Admin",
    account_Balance: 1000,
  },
];

async function seed() {
  for (let user of dataUsers) {
    let data = {
      username: user.username,
      password: user.password,
      firstname: user.name,
      surname: user.surname,
    };
    if (user.role === "Admin") {
      data.admins = {
        create: [{}],
      };
    } else if (user.role === "Seller") {
      data.sellers = {
        create: [{}],
      };
    } else if (user.role === "Customer") {
      data.customers = {
        create: {
          account_Balance: user.account_Balance,
          shipping_address: { create: [user.shipping_address] },
        },
      };
    }
    await prisma.user.create({
      data: data,
    });
    console.log("done");
  }
  prisma.$disconnect();
}

await seed();
 