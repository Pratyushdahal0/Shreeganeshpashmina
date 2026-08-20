ALTER TABLE "WhatsAppInquiry" ADD COLUMN "convertedOrderId" TEXT;
CREATE UNIQUE INDEX "WhatsAppInquiry_convertedOrderId_key" ON "WhatsAppInquiry"("convertedOrderId");
ALTER TABLE "WhatsAppInquiry" ADD CONSTRAINT "WhatsAppInquiry_convertedOrderId_fkey" FOREIGN KEY ("convertedOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
