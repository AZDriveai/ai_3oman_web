import { eq } from "drizzle-orm";
import { connectors } from "../../drizzle/schema";
import { getDb } from "../db";

export async function getUserConnectors(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(connectors)
      .where(eq(connectors.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get user connectors:", error);
    return [];
  }
}

export async function getConnectorById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(connectors)
      .where(eq(connectors.id, id))
      .limit(1);

    if (result.length === 0) return null;
    if (result[0]?.userId !== userId) return null; // Security check

    return result[0];
  } catch (error) {
    console.error("[Database] Failed to get connector:", error);
    return null;
  }
}

export async function createConnector(
  userId: number,
  type: string,
  name: string,
  accessToken?: string,
  refreshToken?: string,
  expiresAt?: Date
) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(connectors).values({
      userId,
      type: type as any,
      name,
      status: "disconnected",
      accessToken,
      refreshToken,
      expiresAt,
    });

    return result;
  } catch (error) {
    console.error("[Database] Failed to create connector:", error);
    return null;
  }
}

export async function updateConnectorStatus(
  id: number,
  userId: number,
  status: "connected" | "disconnected" | "error"
) {
  const db = await getDb();
  if (!db) return false;

  try {
    // Verify ownership
    const connector = await getConnectorById(id, userId);
    if (!connector) return false;

    await db
      .update(connectors)
      .set({ status })
      .where(eq(connectors.id, id));

    return true;
  } catch (error) {
    console.error("[Database] Failed to update connector status:", error);
    return false;
  }
}

export async function deleteConnector(id: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  try {
    // Verify ownership
    const connector = await getConnectorById(id, userId);
    if (!connector) return false;

    await db.delete(connectors).where(eq(connectors.id, id));

    return true;
  } catch (error) {
    console.error("[Database] Failed to delete connector:", error);
    return false;
  }
}
