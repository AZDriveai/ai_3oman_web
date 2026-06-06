CREATE TABLE `generatedImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`prompt` text NOT NULL,
	`imageUrl` varchar(1024) NOT NULL,
	`imageKey` varchar(255) NOT NULL,
	`status` enum('generating','completed','failed') NOT NULL DEFAULT 'generating',
	`error` text,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generatedImages_id` PRIMARY KEY(`id`)
);
