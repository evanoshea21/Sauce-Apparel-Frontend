-- DropForeignKey
ALTER TABLE `Sizes_Inventory` DROP FOREIGN KEY `Sizes_Inventory_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Sizes_Inventory` ADD CONSTRAINT `Sizes_Inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
