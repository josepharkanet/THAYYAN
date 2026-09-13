-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "refNo" TEXT,
    "readyStock" BOOLEAN NOT NULL DEFAULT false,
    "qty" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductImage" ("id", "productId", "sortOrder", "url") SELECT "id", "productId", "sortOrder", "url" FROM "ProductImage";
DROP TABLE "ProductImage";
ALTER TABLE "new_ProductImage" RENAME TO "ProductImage";
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage"("productId");
CREATE INDEX "ProductImage_readyStock_idx" ON "ProductImage"("readyStock");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
