/*
  Warnings:

  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "PostImage";
