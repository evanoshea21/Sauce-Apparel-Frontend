-- CreateTable
CREATE TABLE `Products` (
    `id` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `flavor` VARCHAR(191) NOT NULL,
    `unitPrice` INTEGER NOT NULL,
    `inStock` INTEGER NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `salesPrice` INTEGER NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'uncategorized',
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Products_name_key`(`name`),
    INDEX `Products_name_idx`(`name`),
    UNIQUE INDEX `Products_itemId_name_key`(`itemId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
