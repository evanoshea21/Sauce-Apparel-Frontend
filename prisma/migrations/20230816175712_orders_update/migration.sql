/*
  Warnings:

  - You are about to drop the column `amount` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `amountCharged` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `amount`,
    ADD COLUMN `amountCharged` VARCHAR(191) NOT NULL,
    ADD COLUMN `subtotal` VARCHAR(191) NOT NULL;
