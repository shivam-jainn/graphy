import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "@/lib/utils";
import { db } from "@/lib/database/db";
import { chatHistoryTable } from "@/lib/database/schemas/board-schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { boardId } = await req.json();
    
    const newChat = {
      id: nanoid(),
      boardId,
      title: `New Chat ${new Date().toLocaleDateString()}`,
      createdAt: new Date(), // Use Date object instead of ISO string
    };

    await db.insert(chatHistoryTable).values(newChat);
    return NextResponse.json({
      ...newChat,
      createdAt: newChat.createdAt.toISOString() // Convert to string for response
    });
  } catch (error) {
    console.error("[CREATE_CHAT_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get('boardId');
    
    // Execute the query with proper filtering
    const chats = await db
      .select()
      .from(chatHistoryTable)
      .where(eq(chatHistoryTable.boardId, boardId!))
      .execute();

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("[GET_CHATS_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}