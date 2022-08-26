/*
  Warnings:

  - You are about to drop the column `sequence` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[searchIndex]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[searchIndex]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[searchIndex]` on the table `Subreddit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[searchIndex]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Post_updatedAt_key";

-- DropIndex
DROP INDEX "User_sequence_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "searchIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "searchIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Subreddit" ADD COLUMN     "searchIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sequence",
ADD COLUMN     "searchIndex" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_searchIndex_key" ON "Comment"("searchIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Post_searchIndex_key" ON "Post"("searchIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_searchIndex_key" ON "Subreddit"("searchIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_searchIndex_key" ON "User"("searchIndex");
