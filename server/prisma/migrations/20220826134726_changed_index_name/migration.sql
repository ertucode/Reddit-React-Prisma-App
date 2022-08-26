/*
  Warnings:

  - You are about to drop the column `searchIndex` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `searchIndex` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `searchIndex` on the `Subreddit` table. All the data in the column will be lost.
  - You are about to drop the column `searchIndex` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scrollIndex]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scrollIndex]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scrollIndex]` on the table `Subreddit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scrollIndex]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Comment_searchIndex_key";

-- DropIndex
DROP INDEX "Post_searchIndex_key";

-- DropIndex
DROP INDEX "Subreddit_searchIndex_key";

-- DropIndex
DROP INDEX "User_searchIndex_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "searchIndex",
ADD COLUMN     "scrollIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "searchIndex",
ADD COLUMN     "scrollIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Subreddit" DROP COLUMN "searchIndex",
ADD COLUMN     "scrollIndex" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "searchIndex",
ADD COLUMN     "scrollIndex" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_scrollIndex_key" ON "Comment"("scrollIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Post_scrollIndex_key" ON "Post"("scrollIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_scrollIndex_key" ON "Subreddit"("scrollIndex");

-- CreateIndex
CREATE UNIQUE INDEX "User_scrollIndex_key" ON "User"("scrollIndex");
