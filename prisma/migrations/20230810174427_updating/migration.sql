/*
  Warnings:

  - Added the required column `email` to the `CustomerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `CustomerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `CustomerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `CustomerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CustomerProfile` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;
