import { describe, it, expect, beforeEach, vi } from "vitest";
import { imagesRouter } from "./images";
import * as db from "../db/images";

// Mock the database functions
vi.mock("../db/images", () => ({
  getUserGeneratedImages: vi.fn(),
  getGeneratedImageById: vi.fn(),
  createGeneratedImage: vi.fn(),
  deleteGeneratedImage: vi.fn(),
}));

// Mock the image generation service
vi.mock("../server/_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

// Mock storage
vi.mock("../storage", () => ({
  storagePut: vi.fn(),
}));

describe("images router", () => {
  const mockUserId = "test-user-123";
  const mockImage = {
    id: 1,
    userId: mockUserId,
    prompt: "A beautiful sunset",
    imageUrl: "/manus-storage/image-123.png",
    createdAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("images.list", () => {
    it("should return all images for the user", async () => {
      const mockImages = [mockImage];
      vi.mocked(db.getUserGeneratedImages).mockResolvedValue(mockImages as any);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.images).toEqual(mockImages);
      expect(db.getUserGeneratedImages).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when no images exist", async () => {
      vi.mocked(db.getUserGeneratedImages).mockResolvedValue([]);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(true);
      expect(result.images).toEqual([]);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Database error");
      vi.mocked(db.getUserGeneratedImages).mockRejectedValue(error);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.list();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to fetch images");
    });
  });

  describe("images.get", () => {
    it("should return a specific image by ID", async () => {
      vi.mocked(db.getGeneratedImageById).mockResolvedValue(mockImage as any);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 1 });

      expect(result.success).toBe(true);
      expect(result.image).toEqual(mockImage);
      expect(db.getGeneratedImageById).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should return error when image not found", async () => {
      vi.mocked(db.getGeneratedImageById).mockResolvedValue(null);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.get({ id: 999 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Image not found");
    });
  });

  describe("images.delete", () => {
    it("should delete an image", async () => {
      vi.mocked(db.deleteGeneratedImage).mockResolvedValue(true);

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(true);
      expect(db.deleteGeneratedImage).toHaveBeenCalledWith(1, mockUserId);
    });

    it("should handle deletion errors", async () => {
      vi.mocked(db.deleteGeneratedImage).mockRejectedValue(
        new Error("Delete failed")
      );

      const caller = imagesRouter.createCaller({
        user: { id: mockUserId, role: "user" },
      } as any);

      const result = await caller.delete({ id: 1 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to delete image");
    });
  });
});
