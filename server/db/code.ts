import { eq } from "drizzle-orm";
import { generatedCode, InsertGeneratedCodeItem } from "../../drizzle/schema";
import { getDb } from "../db";

export async function createGeneratedCode(userId: number, data: Omit<InsertGeneratedCodeItem, "userId">) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(generatedCode).values({
      ...data,
      userId,
    });
    return result;
  } catch (error) {
    console.error("[Code] Failed to create code:", error);
    throw error;
  }
}

export async function getUserGeneratedCode(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(generatedCode)
      .where(eq(generatedCode.userId, userId));
    return result;
  } catch (error) {
    console.error("[Code] Failed to get user code:", error);
    return [];
  }
}

export async function getGeneratedCodeById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(generatedCode)
      .where(eq(generatedCode.id, id))
      .limit(1);

    if (result.length === 0 || result[0].userId !== userId) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error("[Code] Failed to get code:", error);
    return null;
  }
}

export async function updateGeneratedCode(id: number, userId: number, data: Partial<InsertGeneratedCodeItem>) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const code = await getGeneratedCodeById(id, userId);
    if (!code) return null;

    const result = await db
      .update(generatedCode)
      .set(data)
      .where(eq(generatedCode.id, id));

    return result;
  } catch (error) {
    console.error("[Code] Failed to update code:", error);
    throw error;
  }
}

export async function deleteGeneratedCode(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const code = await getGeneratedCodeById(id, userId);
    if (!code) return null;

    const result = await db.delete(generatedCode).where(eq(generatedCode.id, id));
    return result;
  } catch (error) {
    console.error("[Code] Failed to delete code:", error);
    throw error;
  }
}
