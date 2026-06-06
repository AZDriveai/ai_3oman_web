import { describe, it, expect, beforeEach, vi } from "vitest";
import { tasksRouter } from "./tasks";
import * as db from "../db/tasks";

// Mock the database functions
vi.mock("../db/tasks", () => ({
  getUserTasks: vi.fn(),
  getTaskById: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}));

describe("tasks router", () => {
  const mockUserId = "test-user-123";
  const mockTask = {
    id: 1,
    userId: mockUserId,
    title: "Test Task",
    description: "A test task",
    schedule: "0 0 * * *",
    status: "pending",
    lastRun: null,
    nextRun: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("tasks.list", () => {
    it("should return all tasks for the user", async () => {
      const mockTasks = [mockTask];
      vi.mocked(db.getUserTasks).mockResolvedValue(mockTasks as any);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.tasks).toEqual(mockTasks);
      expect(db.getUserTasks).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when no tasks exist", async () => {
      vi.mocked(db.getUserTasks).mockResolvedValue([]);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.tasks).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Database error");
      vi.mocked(db.getUserTasks).mockRejectedValue(error);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch tasks");
    });
  });

  describe("tasks.get", () => {
    it("should return a specific task by ID", async () => {
      vi.mocked(db.getTaskById).mockResolvedValue(mockTask as any);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 1 });

      expect(result.success).toBe(true);
      expect(result.task).toEqual(mockTask);
      expect(db.getTaskById).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should return error when task not found", async () => {
      vi.mocked(db.getTaskById).mockResolvedValue(null);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Task not found");
    });
  });

  describe("tasks.create", () => {
    it("should create a new task", async () => {
      vi.mocked(db.createTask).mockResolvedValue({ insertId: 2 } as any);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.create({
        title: "New Task",
        description: "A new task",
        schedule: "0 0 * * *",
      });

      expect(result.success).toBe(true);
      expect(result.task?.title).toBe("New Task");
      expect(db.createTask).toHaveBeenCalled();
    });
  });

  describe("tasks.update", () => {
    it("should update a task", async () => {
      vi.mocked(db.updateTask).mockResolvedValue(true);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.update({
        id: 1,
        status: "running",
      });

      expect(result.success).toBe(true);
      expect(db.updateTask).toHaveBeenCalled();
    });

    it("should handle update errors", async () => {
      vi.mocked(db.updateTask).mockResolvedValue(false);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.update({
        id: 999,
        status: "running",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Task not found or update failed");
    });
  });

  describe("tasks.delete", () => {
    it("should delete a task", async () => {
      vi.mocked(db.deleteTask).mockResolvedValue(true);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(true);
      expect(db.deleteTask).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should handle deletion errors", async () => {
      vi.mocked(db.deleteTask).mockResolvedValue(false);

      const caller = tasksRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Task not found");
    });
  });
});
