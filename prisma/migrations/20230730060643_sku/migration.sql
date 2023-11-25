/*
  Warnings:

  - The primary key for the `Sizes_Inventory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Sizes_Inventory` table. All the data in the column will be lost.
  - The required column `sku` was added to the `Sizes_Inventory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Sizes_Inventory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`sku`);
