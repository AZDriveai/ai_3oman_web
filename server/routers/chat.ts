import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const chatRouter = router({
  /**
   * Send a message to the AI and get a response
   * Supports streaming responses for real-time feedback
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          })
        ),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Call the LLM with the provided messages
        const response = await invokeLLM({
          model: input.model,
          messages: input.messages,
        });

        // Extract the assistant's response
        const assistantMessage =
          response.choices[0]?.message?.content || "عذراً، حدث خطأ في الرد.";

        return {
          success: true,
          message: assistantMessage,
          userId: ctx.user.id,
        };
      } catch (error) {
        console.error("[Chat Error]", error);
        return {
          success: false,
          message: "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة لاحقاً.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  /**
   * Get chat history for the current user
   */
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implement when database schema is ready
    // For now, return empty array
    return {
      conversations: [],
      total: 0,
    };
  }),
});
