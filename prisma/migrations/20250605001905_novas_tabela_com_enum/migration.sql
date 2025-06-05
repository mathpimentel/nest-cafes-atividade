/*
  Warnings:

  - Changed the type of `status` on the `Entrega` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pendente', 'em_transito', 'entregue');

-- AlterTable
ALTER TABLE "Entrega" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
