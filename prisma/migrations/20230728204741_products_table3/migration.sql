/*
  Warnings:

  - A unique constraint covering the columns `[name,flavor]` on the table `Products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Products_name_flavor_key` ON `Products`(`name`, `flavor`);
