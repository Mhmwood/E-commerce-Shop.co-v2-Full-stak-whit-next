/*
  Warnings:

  - Made the column `brand` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discountPercentage" SET DEFAULT 0,
ALTER COLUMN "rating" SET DEFAULT 0,
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "brand" SET DEFAULT 'Unknown',
ALTER COLUMN "weight" DROP NOT NULL,
ALTER COLUMN "warrantyInformation" SET DEFAULT '',
ALTER COLUMN "shippingInformation" SET DEFAULT '',
ALTER COLUMN "availabilityStatus" SET DEFAULT 'InStock',
ALTER COLUMN "returnPolicy" SET DEFAULT '',
ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[];
