import { describe, expect, it, vi } from "vitest";
import { chatRouter } from "./chat";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user ? { ...defaultUser, ...user } : defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("chat router", () => {
  describe("chat.sendMessage", () => {
    it("should return a success response with a message", async () => {
      const ctx = createAuthContext();
      const caller = chatRouter.createCaller(ctx);

      const result = await caller.sendMessage({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Hello, how are you?",
          },
        ],
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe("string");
      expect(result.userId).toBe(1);
    });

    it("should handle errors gracefully", async () => {
      const ctx = createAuthContext();
      const caller = chatRouter.createCaller(ctx);

      // Send empty messages array to trigger an error
      const result = await caller.sendMessage({
        messages: [],
      });

      expect(result).toBeDefined();
      // The result should still be a valid response object
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("message");
    });

    it("should include user ID in response", async () => {
      const ctx = createAuthContext({ id: 42 });
      const caller = chatRouter.createCaller(ctx);

      const result = await caller.sendMessage({
        messages: [
          {
            role: "user",
            content: "Test message",
          },
        ],
      });

      expect(result.userId).toBe(42);
    });
  });

  describe("chat.getHistory", () => {
    it("should return chat history for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = chatRouter.createCaller(ctx);

      const result = await caller.getHistory();

      expect(result).toBeDefined();
      expect(result).toHaveProperty("conversations");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.conversations)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("should return empty history initially", async () => {
      const ctx = createAuthContext();
      const caller = chatRouter.createCaller(ctx);

      const result = await caller.getHistory();

      expect(result.conversations).toEqual([]);
      expect(result.total).toBe(0);
    });
  });
});
