/*
  Warnings:

  - You are about to alter the column `ticketPrice` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "ticketPrice" SET DATA TYPE INTEGER;
