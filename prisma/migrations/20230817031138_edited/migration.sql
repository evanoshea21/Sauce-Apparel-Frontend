/*
  Warnings:

  - You are about to drop the column `salesPrice` on the `Flavors_Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `inventory` on the `Products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Flavors_Inventory` DROP COLUMN `salesPrice`;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `inventory`,
    MODIFY `imageUrl` VARCHAR(500) NOT NULL;
