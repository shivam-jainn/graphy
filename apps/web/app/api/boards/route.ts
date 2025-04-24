import { NextRequest, NextResponse } from "next/server";
// Change nanoid import
import { nanoid } from '@/lib/utils';  // Use project's existing nanoid utility
import { db } from "@/lib/database/db";
import { boardsTable } from "@/lib/database/schemas/board-schema";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log("Raw Request Body:", rawBody); // Debugging log

    const { boardName } = JSON.parse(rawBody);

    if (!boardName) {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 });
    }

    const boardId = nanoid();
    const createdAt = new Date(); // Store as a Date object

    console.log("Inserting Board:", { boardId, boardName, createdAt });

    await db.insert(boardsTable).values({
      id: boardId,
      boardName,
      createdAt, // Pass as a Date object
      updatedAt: createdAt, // Pass as a Date object
    });

    console.log("Board Created Successfully");

    return NextResponse.json({ id: boardId, name: boardName });
  } catch (error) {
    console.error("[CREATE_BOARD_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const boards = await db.select().from(boardsTable).execute();
    console.log(boards);
    return NextResponse.json(boards);
  } catch (error) {
    console.error("[GET_BOARDS_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}