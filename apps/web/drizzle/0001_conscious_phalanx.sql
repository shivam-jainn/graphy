CREATE TABLE "board_chat" (
	"board_id" varchar(191),
	"chat_id" varchar(191),
	CONSTRAINT "board_chat_board_id_chat_id_pk" PRIMARY KEY("board_id","chat_id")
);
--> statement-breakpoint
CREATE TABLE "boards" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"board_name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_history" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"board_id" varchar(191),
	"title" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"chat_id" varchar(191),
	"content" text NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"board_id" varchar(191),
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board_chat" ADD CONSTRAINT "board_chat_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_chat" ADD CONSTRAINT "board_chat_chat_id_chat_history_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chat_history_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_history"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;