/*
  Warnings:

  - You are about to drop the `_LikedPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LikedPosts" DROP CONSTRAINT "_LikedPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikedPosts" DROP CONSTRAINT "_LikedPosts_B_fkey";

-- DropTable
DROP TABLE "_LikedPosts";
