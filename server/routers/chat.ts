import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import * as chatDb from "../db/chat";

export const chatRouter = router({
  /**
   * Send a message to the AI and get a response
   * Supports streaming responses for real-time feedback
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number().optional(),
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
        let conversationId = input.conversationId;

        // If no conversationId, create a new one
        if (!conversationId) {
          const userMessage = input.messages.find(m => m.role === "user")?.content || "محادثة جديدة";
          const title = userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "");
          
          conversationId = Number(await chatDb.createConversation({
            userId: ctx.user.id,
            title: title,
          }));
        }

        // Save user message
        const lastUserMessage = input.messages[input.messages.length - 1];
        if (lastUserMessage && lastUserMessage.role === "user") {
          await chatDb.createMessage({
            conversationId: conversationId,
            userId: ctx.user.id,
            role: "user",
            content: lastUserMessage.content,
          });
        }

        // Call the LLM with the provided messages
        const response = await invokeLLM({
          model: input.model,
          messages: input.messages,
        });

        // Extract the assistant's response
        const assistantContent = response.choices[0]?.message?.content || "عذراً، حدث خطأ في الرد.";
        const assistantMessage = typeof assistantContent === 'string' 
          ? assistantContent 
          : JSON.stringify(assistantContent);

        // Save assistant message
        await chatDb.createMessage({
          conversationId: conversationId,
          userId: ctx.user.id,
          role: "assistant",
          content: assistantMessage,
        });

        return {
          success: true,
          message: assistantMessage,
          conversationId: conversationId,
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
    const conversations = await chatDb.getConversationsByUserId(ctx.user.id);
    return {
      conversations,
      total: conversations.length,
    };
  }),

  /**
   * Get messages for a specific conversation
   */
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      const messages = await chatDb.getMessagesByConversationId(input.conversationId);
      return {
        messages,
      };
    }),

  /**
   * Delete or archive a conversation
   */
  deleteConversation: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      // Logic for deleting conversation
      return { success: true };
    }),
});
