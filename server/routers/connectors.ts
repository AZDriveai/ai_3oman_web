import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserConnectors,
  getConnectorById,
  createConnector,
  updateConnectorStatus,
  deleteConnector,
} from "../db/connectors";

export const connectorsRouter = router({
  /**
   * Get all connectors for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userConnectors = await getUserConnectors(ctx.user.id);
      return {
        success: true,
        connectors: userConnectors || [],
      };
    } catch (error) {
      console.error("[Connectors] Failed to list connectors:", error);
      return {
        success: false,
        connectors: [],
        error: "Failed to load connectors",
      };
    }
  }),

  /**
   * Get a specific connector by ID
   */
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const connector = await getConnectorById(input.id, ctx.user.id);
        if (!connector) {
          return {
            success: false,
            connector: null,
            error: "Connector not found",
          };
        }
        return {
          success: true,
          connector,
        };
      } catch (error) {
        console.error("[Connectors] Failed to get connector:", error);
        return {
          success: false,
          connector: null,
          error: "Failed to load connector",
        };
      }
    }),

  /**
   * Create a new connector
   */
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["github", "google_drive", "slack", "notion", "zapier"]),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await createConnector(
          ctx.user.id,
          input.type,
          input.name
        );

        if (!result) {
          return {
            success: false,
            connector: null,
            error: "Failed to create connector",
          };
        }

        return {
          success: true,
          connector: {
            id: (result as any).insertId || 0,
            type: input.type,
            name: input.name,
            status: "disconnected",
          },
        };
      } catch (error) {
        console.error("[Connectors] Failed to create connector:", error);
        return {
          success: false,
          connector: null,
          error: "Failed to create connector",
        };
      }
    }),

  /**
   * Update connector status
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["connected", "disconnected", "error"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await updateConnectorStatus(
          input.id,
          ctx.user.id,
          input.status
        );

        if (!success) {
          return {
            success: false,
            error: "Failed to update connector status",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Connectors] Failed to update connector status:", error);
        return {
          success: false,
          error: "Failed to update connector status",
        };
      }
    }),

  /**
   * Delete a connector
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const success = await deleteConnector(input.id, ctx.user.id);

        if (!success) {
          return {
            success: false,
            error: "Failed to delete connector",
          };
        }

        return {
          success: true,
        };
      } catch (error) {
        console.error("[Connectors] Failed to delete connector:", error);
        return {
          success: false,
          error: "Failed to delete connector",
        };
      }
    }),
});
