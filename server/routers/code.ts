import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { createGeneratedCode, getUserGeneratedCode, getGeneratedCodeById, deleteGeneratedCode, updateGeneratedCode } from "../db/code";

const CODE_GENERATION_PROMPT = `You are an expert React developer. Generate clean, well-structured React code based on the user's requirements.

Requirements:
- Use React 19 with hooks
- Use Tailwind CSS for styling
- Make the code production-ready
- Include proper TypeScript types
- Add comments for complex logic
- Ensure accessibility

Return ONLY the code, no explanations or markdown formatting.`;

export const codeRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const codes = await getUserGeneratedCode(ctx.user.id);
      return {
        success: true,
        codes: codes || [],
      };
    } catch (error) {
      console.error("[Code] Failed to list code:", error);
      return {
        success: false,
        codes: [],
        error: "Failed to fetch code",
      };
    }
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const code = await getGeneratedCodeById(input.id, ctx.user.id);
        if (!code) {
          return {
            success: false,
            code: null,
            error: "Code not found",
          };
        }

        return {
          success: true,
          code,
        };
      } catch (error) {
        console.error("[Code] Failed to get code:", error);
        return {
          success: false,
          code: null,
          error: "Failed to fetch code",
        };
      }
    }),

  generate: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        prompt: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create initial record with "generating" status
        const createResult = await createGeneratedCode(ctx.user.id, {
          title: input.title,
          prompt: input.prompt,
          description: input.description,
          code: "",
          language: "jsx",
          status: "generating",
        });

        if (!createResult) {
          return {
            success: false,
            code: null,
            error: "Failed to create code record",
          };
        }

        // Generate code using LLM
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: CODE_GENERATION_PROMPT },
              { role: "user", content: input.prompt },
            ] as any,
          });

          if (!response?.choices?.[0]?.message?.content) {
            throw new Error("No code generated from LLM");
          }

          const content = response.choices[0].message.content;
          const generatedCode = typeof content === 'string' 
            ? content 
            : Array.isArray(content) 
              ? content.map(c => (c as any).text || '').join('') 
              : String(content);

          // Update record with generated code
          const codeId = (createResult as any).insertId || 0;
          if (codeId) {
            await updateGeneratedCode(codeId, ctx.user.id, {
              code: generatedCode,
              status: "completed",
            });
          }

          return {
            success: true,
            code: {
              id: codeId,
              title: input.title,
              prompt: input.prompt,
              code: generatedCode,
              status: "completed",
            },
          };
        } catch (generateError) {
          console.error("[Code] Generation failed:", generateError);

          // Update record with error
          const codeId = (createResult as any).insertId || 0;
          await updateGeneratedCode(codeId, ctx.user.id, {
            status: "failed",
            error: generateError instanceof Error ? generateError.message : "Generation failed",
          });

          return {
            success: false,
            code: null,
            error: "Code generation failed",
          };
        }
      } catch (error) {
        console.error("[Code] Failed to generate code:", error);
        return {
          success: false,
          code: null,
          error: "Failed to generate code",
        };
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await deleteGeneratedCode(input.id, ctx.user.id);

        if (!result) {
          return {
            success: false,
            error: "Code not found",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Code] Failed to delete code:", error);
        return {
          success: false,
          error: "Failed to delete code",
        };
      }
    }),
});
