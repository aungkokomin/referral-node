/*
  Warnings:

  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `roleId`;

-- CreateTable
CREATE TABLE `ReferralLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `referrerId` VARCHAR(191) NOT NULL,
    `refereeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
