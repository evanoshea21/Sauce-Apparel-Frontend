/*
  Warnings:

  - You are about to drop the column `itemId` on the `Products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Products_itemId_name_key` ON `Products`;

-- AlterTable
ALTER TABLE `Products` DROP COLUMN `itemId`;
