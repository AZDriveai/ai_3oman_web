import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("auth", () => {
  describe("auth.me", () => {
    it("returns the current authenticated user", async () => {
      const ctx = createAuthContext({
        id: 42,
        name: "Alice",
        email: "alice@example.com",
      });
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.id).toBe(42);
      expect(user?.name).toBe("Alice");
      expect(user?.email).toBe("alice@example.com");
      expect(user?.role).toBe("user");
    });

    it("returns null when no user is authenticated", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as TrpcContext["req"],
        res: {
          clearCookie: () => {},
        } as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeNull();
    });

    it("returns admin user with correct role", async () => {
      const ctx = createAuthContext({
        role: "admin",
      });
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user?.role).toBe("admin");
    });
  });

  describe("auth.logout", () => {
    it("clears the session cookie on logout", async () => {
      const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

      const ctx = createAuthContext();
      ctx.res.clearCookie = (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      };

      const caller = appRouter.createCaller(ctx);
      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe("app_session_id");
      expect(clearedCookies[0]?.options.maxAge).toBe(-1);
    });
  });
});
