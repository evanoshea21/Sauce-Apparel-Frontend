/*
  Warnings:

  - A unique constraint covering the columns `[name,size]` on the table `Products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Products_name_size_key` ON `Products`(`name`, `size`);
