-- CreateTable
CREATE TABLE `Order` (
    `refTransId` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `cardNum` VARCHAR(191) NOT NULL,
    `expDate` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Order_refTransId_key`(`refTransId`),
    PRIMARY KEY (`refTransId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasedItems` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `unitPrice` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `refTransId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchasedItems` ADD CONSTRAINT `PurchasedItems_refTransId_fkey` FOREIGN KEY (`refTransId`) REFERENCES `Order`(`refTransId`) ON DELETE CASCADE ON UPDATE CASCADE;
