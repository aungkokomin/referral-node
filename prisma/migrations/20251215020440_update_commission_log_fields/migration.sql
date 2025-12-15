/*
  Warnings:

  - You are about to drop the column `userId` on the `CommissionLog` table. All the data in the column will be lost.
  - Added the required column `refereeId` to the `CommissionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerId` to the `CommissionLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CommissionLog` DROP FOREIGN KEY `CommissionLog_userId_fkey`;

-- AlterTable
ALTER TABLE `CommissionLog` DROP COLUMN `userId`,
    ADD COLUMN `refereeId` INTEGER NOT NULL,
    ADD COLUMN `referrerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CommissionLog` ADD CONSTRAINT `CommissionLog_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommissionLog` ADD CONSTRAINT `CommissionLog_refereeId_fkey` FOREIGN KEY (`refereeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
