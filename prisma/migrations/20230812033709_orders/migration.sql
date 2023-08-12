/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PurchasedItems` DROP FOREIGN KEY `PurchasedItems_refTransId_fkey`;

-- DropTable
DROP TABLE `Order`;

-- CreateTable
CREATE TABLE `Orders` (
    `refTransId` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `cardNum` VARCHAR(191) NOT NULL,
    `expDate` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Orders_refTransId_key`(`refTransId`),
    PRIMARY KEY (`refTransId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchasedItems` ADD CONSTRAINT `PurchasedItems_refTransId_fkey` FOREIGN KEY (`refTransId`) REFERENCES `Orders`(`refTransId`) ON DELETE CASCADE ON UPDATE CASCADE;
