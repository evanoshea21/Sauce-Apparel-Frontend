/*
  Warnings:

  - You are about to drop the column `size` on the `Products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Products_name_size_key` ON `Products`;

-- DropIndex
DROP INDEX `Products_name_idx` ON `Products`;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `size`;

-- CreateTable
CREATE TABLE `Sizes_Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `stockCount` INTEGER NOT NULL,

    INDEX `Sizes_Inventory_productId_idx`(`productId`),
    UNIQUE INDEX `Sizes_Inventory_productId_size_key`(`productId`, `size`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Products_id_idx` ON `Products`(`id`);

-- AddForeignKey
ALTER TABLE `Sizes_Inventory` ADD CONSTRAINT `Sizes_Inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
