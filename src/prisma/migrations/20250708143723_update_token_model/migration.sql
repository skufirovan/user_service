/*
  Warnings:

  - A unique constraint covering the columns `[user_id,user_agent]` on the table `token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_user_agent_key" ON "token"("user_id", "user_agent");
