import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { createTask, getUserTasks, getTaskById, updateTask, deleteTask } from "../db/tasks";

export const tasksRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userTasks = await getUserTasks(ctx.user.id);
      return {
        success: true,
        tasks: userTasks || [],
      };
    } catch (error) {
      console.error("[Tasks] Failed to list tasks:", error);
      return {
        success: false,
        tasks: [],
        error: "Failed to fetch tasks",
      };
    }
  }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const task = await getTaskById(input.id, ctx.user.id);
        if (!task) {
          return {
            success: false,
            task: null,
            error: "Task not found",
          };
        }

        return {
          success: true,
          task,
        };
      } catch (error) {
        console.error("[Tasks] Failed to get task:", error);
        return {
          success: false,
          task: null,
          error: "Failed to fetch task",
        };
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        schedule: z.string().optional(), // Cron expression
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await createTask(ctx.user.id, {
          title: input.title,
          description: input.description,
          schedule: input.schedule,
          status: "pending",
        });

        if (!result) {
          return {
            success: false,
            task: null,
            error: "Failed to create task",
          };
        }

        return {
          success: true,
          task: {
            id: (result as any).insertId || 0,
            title: input.title,
            description: input.description,
            schedule: input.schedule,
            status: "pending",
          },
        };
      } catch (error) {
        console.error("[Tasks] Failed to create task:", error);
        return {
          success: false,
          task: null,
          error: "Failed to create task",
        };
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        schedule: z.string().optional(),
        status: z.enum(["pending", "running", "completed", "failed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        const result = await updateTask(id, ctx.user.id, updateData);

        if (!result) {
          return {
            success: false,
            error: "Task not found or update failed",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Tasks] Failed to update task:", error);
        return {
          success: false,
          error: "Failed to update task",
        };
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await deleteTask(input.id, ctx.user.id);

        if (!result) {
          return {
            success: false,
            error: "Task not found",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Tasks] Failed to delete task:", error);
        return {
          success: false,
          error: "Failed to delete task",
        };
      }
    }),
});
