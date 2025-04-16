-- DropIndex
DROP INDEX "orders_orderNumber_key";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "orderNumber" SET DATA TYPE TEXT;
