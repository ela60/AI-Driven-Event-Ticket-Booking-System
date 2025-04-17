/*
  Warnings:

  - Changed the type of `category` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PUBLISHED',
ALTER COLUMN "availableTickets" DROP NOT NULL;

-- DropEnum
DROP TYPE "EventCategory";
