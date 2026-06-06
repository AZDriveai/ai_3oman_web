CREATE TABLE `generatedCode` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`prompt` text NOT NULL,
	`code` text NOT NULL,
	`language` varchar(50) NOT NULL DEFAULT 'jsx',
	`status` enum('generating','completed','failed') NOT NULL DEFAULT 'generating',
	`error` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generatedCode_id` PRIMARY KEY(`id`)
);
