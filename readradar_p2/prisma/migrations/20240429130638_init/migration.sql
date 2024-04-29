-- CreateTable
CREATE TABLE "Book" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "genre" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "cover" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "accountBalance" REAL NOT NULL,
    "shipId" INTEGER,
    CONSTRAINT "Customer_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "ShippingAddress" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstname" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "accountBalance" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookId" INTEGER NOT NULL,
    "sellerId" TEXT NOT NULL,
    "custId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Transaction_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_custId_fkey" FOREIGN KEY ("custId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Login" (
    "username" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL
);
