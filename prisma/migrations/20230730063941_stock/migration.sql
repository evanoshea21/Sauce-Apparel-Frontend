/*
  Warnings:

  - You are about to drop the column `stockCount` on the `Sizes_Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Products` table. All the data in the column will be lost.
  - Added the required column `inventory` to the `Sizes_Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Sizes_Inventory` DROP COLUMN `stockCount`,
    ADD COLUMN `inventory` INTEGER NOT NULL,
    ADD COLUMN `salesPrice` INTEGER NULL;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `stock`;
