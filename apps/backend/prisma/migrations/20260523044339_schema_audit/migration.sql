/*
  Warnings:

  - The values [MODERATOR,FORUM_ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[postId,order]` on the table `post_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetType` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `verification_codes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VerificationCodeType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "NotificationTargetType" AS ENUM ('POST', 'COMMENT', 'FORUM', 'REPORT');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('BASE', 'SYSTEM_ADMIN', 'INSTITUTIONAL_ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'BASE';
COMMIT;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "targetType",
ADD COLUMN     "targetType" "NotificationTargetType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "keepContentOnDelete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "verification_codes" DROP COLUMN "type",
ADD COLUMN     "type" "VerificationCodeType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "post_images_postId_order_key" ON "post_images"("postId", "order");

-- CreateIndex
CREATE INDEX "verification_codes_userId_type_idx" ON "verification_codes"("userId", "type");
