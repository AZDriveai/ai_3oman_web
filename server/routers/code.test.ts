import { describe, it, expect, beforeEach, vi } from "vitest";
import { codeRouter } from "./code";
import * as db from "../db/code";

// Mock the database functions
vi.mock("../db/code", () => ({
  getUserGeneratedCode: vi.fn(),
  getGeneratedCodeById: vi.fn(),
  createGeneratedCode: vi.fn(),
  deleteGeneratedCode: vi.fn(),
  updateGeneratedCode: vi.fn(),
}));

// Mock the LLM service
vi.mock("../server/_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

// Mock storage
vi.mock("../storage", () => ({
  storagePut: vi.fn(),
}));

describe("code router", () => {
  const mockUserId = "test-user-123";
  const mockCode = {
    id: 1,
    userId: mockUserId,
    title: "Button Component",
    description: "A reusable button component",
    prompt: "Create a button component",
    generatedCode: "export function Button() { return <button>Click me</button>; }",
    language: "jsx",
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("code.list", () => {
    it("should return all code snippets for the user", async () => {
      const mockCodeSnippets = [mockCode];
      vi.mocked(db.getUserGeneratedCode).mockResolvedValue(mockCodeSnippets as any);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.codes).toEqual(mockCodeSnippets);
      expect(db.getUserGeneratedCode).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when no code snippets exist", async () => {
      vi.mocked(db.getUserGeneratedCode).mockResolvedValue([]);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.codes).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Database error");
      vi.mocked(db.getUserGeneratedCode).mockRejectedValue(error);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch code");
    });
  });

  describe("code.get", () => {
    it("should return a specific code snippet by ID", async () => {
      vi.mocked(db.getGeneratedCodeById).mockResolvedValue(mockCode as any);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 1 });

      expect(result.success).toBe(true);
      expect(result.code).toEqual(mockCode);
      expect(db.getGeneratedCodeById).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should return error when code snippet not found", async () => {
      vi.mocked(db.getGeneratedCodeById).mockResolvedValue(null);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Code not found");
    });
  });

  describe("code.delete", () => {
    it("should delete a code snippet", async () => {
      vi.mocked(db.deleteGeneratedCode).mockResolvedValue(true);

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(true);
      expect(db.deleteGeneratedCode).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should handle deletion errors", async () => {
      vi.mocked(db.deleteGeneratedCode).mockRejectedValue(
        new Error("Delete failed")
      );

      const caller = codeRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to delete code");
    });
  });
});
