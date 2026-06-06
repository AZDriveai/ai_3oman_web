import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { generateImage } from "../_core/imageGeneration";
import { storagePut } from "../storage";
import { createGeneratedImage, getUserGeneratedImages, getGeneratedImageById, deleteGeneratedImage } from "../db/images";

export const imagesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const images = await getUserGeneratedImages(ctx.user.id);
      return {
        success: true,
        images: images || [],
      };
    } catch (error) {
      console.error("[Images] Failed to list images:", error);
      return {
        success: false,
        images: [],
        error: "Failed to fetch images",
      };
    }
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const image = await getGeneratedImageById(input.id, ctx.user.id);
        if (!image) {
          return {
            success: false,
            image: null,
            error: "Image not found",
          };
        }

        return {
          success: true,
          image,
        };
      } catch (error) {
        console.error("[Images] Failed to get image:", error);
        return {
          success: false,
          image: null,
          error: "Failed to fetch image",
        };
      }
    }),

  generate: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        editMode: z.boolean().optional(),
        originalImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create initial record with "generating" status
        const createResult = await createGeneratedImage(ctx.user.id, {
          prompt: input.prompt,
          imageUrl: "",
          imageKey: "",
          status: "generating",
        });

        if (!createResult) {
          return {
            success: false,
            image: null,
            error: "Failed to create image record",
          };
        }

        // Generate image using AI service
        try {
          const imageData = await generateImage({
            prompt: input.prompt,
            ...(input.editMode && input.originalImageUrl && {
              originalImages: [{
                url: input.originalImageUrl,
                mimeType: "image/jpeg",
              }],
            }),
          });

          if (!imageData?.url) {
            throw new Error("No image URL returned from generation service");
          }

          // Upload to storage
          const response = await fetch(imageData.url);
          const buffer = await response.arrayBuffer();

          const { key, url } = await storagePut(
            `user-${ctx.user.id}/images/${Date.now()}.png`,
            Buffer.from(buffer),
            "image/png"
          );

          // Update record with generated image
          await updateGeneratedImage((createResult as any).insertId || 0, ctx.user.id, {
            imageUrl: url,
            imageKey: key,
            status: "completed",
          });

          return {
            success: true,
            image: {
              id: (createResult as any).insertId || 0,
              prompt: input.prompt,
              imageUrl: url,
              imageKey: key,
              status: "completed",
            },
          };
        } catch (generateError) {
          console.error("[Images] Generation failed:", generateError);
          
          // Update record with error
          await updateGeneratedImage((createResult as any).insertId || 0, ctx.user.id, {
            status: "failed",
            error: generateError instanceof Error ? generateError.message : "Generation failed",
          });

          return {
            success: false,
            image: null,
            error: "Image generation failed",
          };
        }
      } catch (error) {
        console.error("[Images] Failed to generate image:", error);
        return {
          success: false,
          image: null,
          error: "Failed to generate image",
        };
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await deleteGeneratedImage(input.id, ctx.user.id);

        if (!result) {
          return {
            success: false,
            error: "Image not found",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Images] Failed to delete image:", error);
        return {
          success: false,
          error: "Failed to delete image",
        };
      }
    }),
});

// Helper function for updating generated images
async function updateGeneratedImage(id: number, userId: number, data: any) {
  const db = await (await import("../db")).getDb();
  if (!db) return null;

  try {
    const { generatedImages } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");

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
