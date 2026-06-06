import { relations } from "drizzle-orm/relations";
import { users, conversations, messages, tasks, generatedImages, generatedCode, connectors } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
	conversations: many(conversations),
	tasks: many(tasks),
	generatedImages: many(generatedImages),
	generatedCode: many(generatedCode),
	connectors: many(connectors),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
	user: one(users, {
		fields: [conversations.userId],
		references: [users.id],
	}),
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
	user: one(users, {
		fields: [messages.userId],
		references: [users.id],
	}),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id],
	}),
}));

export const generatedImagesRelations = relations(generatedImages, ({ one }) => ({
	user: one(users, {
		fields: [generatedImages.userId],
		references: [users.id],
	}),
}));

export const generatedCodeRelations = relations(generatedCode, ({ one }) => ({
	user: one(users, {
		fields: [generatedCode.userId],
		references: [users.id],
	}),
}));

export const connectorsRelations = relations(connectors, ({ one }) => ({
	user: one(users, {
		fields: [connectors.userId],
		references: [users.id],
	}),
}));
