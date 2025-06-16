-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "warrantyInformation" DROP NOT NULL,
ALTER COLUMN "shippingInformation" DROP NOT NULL,
ALTER COLUMN "availabilityStatus" DROP NOT NULL,
ALTER COLUMN "returnPolicy" DROP NOT NULL,
ALTER COLUMN "minimumOrderQuantity" DROP NOT NULL;
