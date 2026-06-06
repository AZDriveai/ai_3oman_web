import { describe, it, expect, beforeEach, vi } from "vitest";
import { connectorsRouter } from "./connectors";
import * as db from "../db/connectors";

// Mock the database functions
vi.mock("../db/connectors", () => ({
  getUserConnectors: vi.fn(),
  getConnectorById: vi.fn(),
  createConnector: vi.fn(),
  updateConnectorStatus: vi.fn(),
  deleteConnector: vi.fn(),
}));

describe("connectors router", () => {
  const mockUserId = "test-user-123";
  const mockConnector = {
    id: 1,
    userId: mockUserId,
    name: "GitHub",
    type: "github",
    status: "connected",
    config: JSON.stringify({ token: "test-token" }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("connectors.list", () => {
    it("should return all connectors for the user", async () => {
      const mockConnectors = [mockConnector];
      vi.mocked(db.getUserConnectors).mockResolvedValue(mockConnectors as any);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.connectors).toEqual(mockConnectors);
      expect(db.getUserConnectors).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when no connectors exist", async () => {
      vi.mocked(db.getUserConnectors).mockResolvedValue([]);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.connectors).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Database error");
      vi.mocked(db.getUserConnectors).mockRejectedValue(error);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to load connectors");
    });
  });

  describe("connectors.get", () => {
    it("should return a specific connector by ID", async () => {
      vi.mocked(db.getConnectorById).mockResolvedValue(mockConnector as any);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 1 });

      expect(result.success).toBe(true);
      expect(result.connector).toEqual(mockConnector);
      expect(db.getConnectorById).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should return error when connector not found", async () => {
      vi.mocked(db.getConnectorById).mockResolvedValue(null);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connector not found");
    });
  });

  describe("connectors.create", () => {
    it("should create a new connector", async () => {
      vi.mocked(db.createConnector).mockResolvedValue({ insertId: 2 } as any);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.create({
        name: "GitHub",
        type: "github",
      });

      expect(result.success).toBe(true);
      expect(result.connector?.name).toBe("GitHub");
      expect(result.connector?.status).toBe("disconnected");
      expect(db.createConnector).toHaveBeenCalled();
    });
  });

  describe("connectors.updateStatus", () => {
    it("should update connector status", async () => {
      vi.mocked(db.updateConnectorStatus).mockResolvedValue(true);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.updateStatus({
        id: 1,
        status: "disconnected",
      });

      expect(result.success).toBe(true);
      expect(db.updateConnectorStatus).toHaveBeenCalledWith(
        1,
        mockUserId,
        "disconnected"
      );
    });

    it("should handle update errors", async () => {
      vi.mocked(db.updateConnectorStatus).mockResolvedValue(false);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.updateStatus({
        id: 999,
        status: "connected",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to update connector status");
    });
  });

  describe("connectors.delete", () => {
    it("should delete a connector", async () => {
      vi.mocked(db.deleteConnector).mockResolvedValue(true);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(true);
      expect(db.deleteConnector).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should handle deletion errors", async () => {
      vi.mocked(db.deleteConnector).mockResolvedValue(false);

      const caller = connectorsRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to delete connector");
    });
  });
});
