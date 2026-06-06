import { eq } from "drizzle-orm";
import { generatedImages, InsertGeneratedImage } from "../../drizzle/schema";
import { getDb } from "../db";

export async function createGeneratedImage(userId: number, data: Omit<InsertGeneratedImage, "userId">) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(generatedImages).values({
      ...data,
      userId,
    });
    return result;
  } catch (error) {
    console.error("[Images] Failed to create image:", error);
    throw error;
  }
}

export async function getUserGeneratedImages(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.userId, userId));
    return result;
  } catch (error) {
    console.error("[Images] Failed to get user images:", error);
    return [];
  }
}

export async function getGeneratedImageById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.id, id))
      .limit(1);

    if (result.length === 0 || result[0].userId !== userId) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error("[Images] Failed to get image:", error);
    return null;
  }
}

export async function updateGeneratedImage(id: number, userId: number, data: Partial<InsertGeneratedImage>) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const image = await getGeneratedImageById(id, userId);
    if (!image) return null;

    const result = await db
      .update(generatedImages)
      .set(data)
      .where(eq(generatedImages.id, id));

    return result;
  } catch (error) {
    console.error("[Images] Failed to update image:", error);
    throw error;
  }
}

export async function deleteGeneratedImage(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const image = await getGeneratedImageById(id, userId);
    if (!image) return null;

    const result = await db.delete(generatedImages).where(eq(generatedImages.id, id));
    return result;
  } catch (error) {
    console.error("[Images] Failed to delete image:", error);
    throw error;
  }
}
