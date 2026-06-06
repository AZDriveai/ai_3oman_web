import { eq } from "drizzle-orm";
import { tasks, InsertTask } from "../../drizzle/schema";
import { getDb } from "../db";

export async function createTask(userId: number, data: Omit<InsertTask, "userId">) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(tasks).values({
      ...data,
      userId,
    });
    return result;
  } catch (error) {
    console.error("[Tasks] Failed to create task:", error);
    throw error;
  }
}

export async function getUserTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));
    return result;
  } catch (error) {
    console.error("[Tasks] Failed to get user tasks:", error);
    return [];
  }
}

export async function getTaskById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .limit(1);

    if (result.length === 0 || result[0].userId !== userId) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error("[Tasks] Failed to get task:", error);
    return null;
  }
}

export async function updateTask(id: number, userId: number, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const task = await getTaskById(id, userId);
    if (!task) return null;

    const result = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.id, id));

    return result;
  } catch (error) {
    console.error("[Tasks] Failed to update task:", error);
    throw error;
  }
}

export async function deleteTask(id: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    // Verify ownership
    const task = await getTaskById(id, userId);
    if (!task) return null;

    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result;
  } catch (error) {
    console.error("[Tasks] Failed to delete task:", error);
    throw error;
  }
}
