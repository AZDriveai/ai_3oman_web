import { eq, desc, and } from "drizzle-orm";
import { getDb } from "../db";
import { conversations, messages, InsertConversation, InsertMessage } from "../../drizzle/schema";

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(conversations).values(data);
  return result.insertId;
}

export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
  return result || null;
}

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) return null;
  
  const [result] = await db.insert(messages).values(data);
  
  // Update conversation updatedAt
  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, data.conversationId));
    
  return result.insertId;
}

export async function getMessagesByConversationId(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function updateConversationTitle(id: number, title: string) {
  const db = await getDb();
  if (!db) return;
  
  await db
    .update(conversations)
    .set({ title })
    .where(eq(conversations.id, id));
}
