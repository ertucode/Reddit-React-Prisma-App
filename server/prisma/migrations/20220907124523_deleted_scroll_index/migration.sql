/*
  Warnings:

  - You are about to drop the column `scrollIndex` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `scrollIndex` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `scrollIndex` on the `Subreddit` table. All the data in the column will be lost.
  - You are about to drop the column `scrollIndex` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Comment_scrollIndex_key";

-- DropIndex
DROP INDEX "Post_scrollIndex_key";

-- DropIndex
DROP INDEX "Subreddit_scrollIndex_key";

-- DropIndex
DROP INDEX "User_scrollIndex_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "scrollIndex";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "scrollIndex";

-- AlterTable
ALTER TABLE "Subreddit" DROP COLUMN "scrollIndex";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "scrollIndex";
