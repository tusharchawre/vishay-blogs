-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "search_text" TEXT;

-- CreateIndex
CREATE INDEX "Post_title_idx" ON "Post"("title");

-- CreateIndex
CREATE INDEX "Post_search_text_idx" ON "Post"("search_text");

-- CreateIndex
CREATE INDEX "Post_published_idx" ON "Post"("published");
