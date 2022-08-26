/*
  Warnings:

  - A unique constraint covering the columns `[sequence]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sequence" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_sequence_key" ON "User"("sequence");
