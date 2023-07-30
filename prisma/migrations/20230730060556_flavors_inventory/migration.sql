/*
  Warnings:

  - You are about to drop the column `flavor` on the `Products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Products_name_flavor_key` ON `Products`;

-- DropIndex
DROP INDEX `Products_name_idx` ON `Products`;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `flavor`;

-- CreateTable
CREATE TABLE `Flavors_Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `flavor` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `stockCount` INTEGER NOT NULL,

    INDEX `Flavors_Inventory_productId_idx`(`productId`),
    UNIQUE INDEX `Flavors_Inventory_productId_flavor_key`(`productId`, `flavor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Products_id_idx` ON `Products`(`id`);

-- AddForeignKey
ALTER TABLE `Flavors_Inventory` ADD CONSTRAINT `Flavors_Inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
