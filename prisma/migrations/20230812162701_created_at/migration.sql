-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'unfulfilled',
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Products` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `CustomerProfile`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
