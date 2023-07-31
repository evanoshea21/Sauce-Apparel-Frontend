/*
  Warnings:

  - Made the column `category` on table `Products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Products` MODIFY `category` VARCHAR(191) NOT NULL DEFAULT 'uncategorized';
