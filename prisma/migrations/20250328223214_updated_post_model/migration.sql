/*
  Warnings:

  - Added the required column `createdByName` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `createdByName` VARCHAR(191) NOT NULL;
