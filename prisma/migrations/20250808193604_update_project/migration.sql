/*
  Warnings:

  - You are about to drop the column `decription` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "decription",
ADD COLUMN     "description" TEXT;
