/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `CustomerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CustomerProfile_userId_key` ON `CustomerProfile`(`userId`);
