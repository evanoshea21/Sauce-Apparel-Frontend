-- DropForeignKey
ALTER TABLE `Flavors_Inventory` DROP FOREIGN KEY `Flavors_Inventory_productId_fkey`;

-- AddForeignKey
ALTER TABLE `Flavors_Inventory` ADD CONSTRAINT `Flavors_Inventory_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
