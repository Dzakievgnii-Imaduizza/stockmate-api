/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `StockRule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "StockRule_product_id_key" ON "StockRule"("product_id");
