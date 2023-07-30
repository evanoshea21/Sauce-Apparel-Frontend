-- AlterTable
ALTER TABLE `Flavors_Inventory` MODIFY `salesPrice` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Products` MODIFY `unitPrice` VARCHAR(191) NOT NULL,
    MODIFY `salesPrice` VARCHAR(191) NULL;
