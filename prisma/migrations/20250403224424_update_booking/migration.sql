/*
  Warnings:

  - You are about to drop the column `numberOfTickets` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "numberOfTickets",
DROP COLUMN "totalPrice";
