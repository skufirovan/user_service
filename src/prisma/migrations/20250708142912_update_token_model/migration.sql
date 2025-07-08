/*
  Warnings:

  - You are about to drop the column `createdAt` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `token` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `token` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "token" DROP CONSTRAINT "token_userId_fkey";

-- AlterTable
ALTER TABLE "token" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
