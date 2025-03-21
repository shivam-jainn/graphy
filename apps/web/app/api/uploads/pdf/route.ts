import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from '@/lib/utils';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { dbindex } from '@/lib/database/db';
import { db } from '@/lib/database/db';
import { uploadsTable } from '@/lib/database/schemas/board-schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const boardId = formData.get('boardId') as string | null;
    const chatId = formData.get('chatId') as string | null;

    if (!file || !boardId || !chatId) {
      return NextResponse.json(
        { error: 'File, boardId, or chatId is missing' },
        { status: 400 }
      );
    }

    // Create uploads directory if not exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Save file locally
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${nanoid()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Insert file metadata into the uploads table
    const fileId = nanoid();
    await db.insert(uploadsTable).values({
      id: fileId,
      boardId: String(boardId),
      chatId: String(chatId),
      fileName: String(fileName),
      fileUrl: String(filePath),
      createdAt: new Date(), // Changed from toISOString()
    });

    // Process PDF and generate embeddings
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    for (const chunk of chunks) {
      try {
        // Generate embeddings for the chunk
        const embeds = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: chunk.pageContent,
        });

        // Ensure the embedding data exists
        if (!embeds.data || !embeds.data[0]?.embedding) {
          console.error('Embedding generation failed for chunk:', chunk.pageContent);
          continue; // Skip this chunk and proceed with the next
        }

        // Prepare the vector for upsert
        const vector = {
          id: nanoid(),
          values: embeds.data[0].embedding,
          metadata: {
            boardId,
            chatId,
            fileId,
            content: chunk.pageContent,
          },
        };

        // Upsert the vector into Pinecone
        await dbindex.upsert([vector]);
      } catch (error) {
        console.error('Error processing chunk:', chunk.pageContent, error);
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      fileName,
    });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}