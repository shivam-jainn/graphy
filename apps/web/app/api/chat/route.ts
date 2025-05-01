import { groq } from '@ai-sdk/groq';
import { streamText, embed } from 'ai';
import { dbindex } from '@/lib/database/db';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { nanoid } from '@/lib/utils';
import { db } from '@/lib/database/db';
import { chatHistoryTable } from '@/lib/database/schemas/board-schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));

    let { messages, chatId, boardID } = body;

    // Create new chat session if none exists
    if (!chatId) {
      const newChat = await db.insert(chatHistoryTable).values({
        id: nanoid(),
        title: 'New Chat',
        createdAt: new Date(),
      }).returning();
      chatId = newChat[0].id;
    }

    if (messages && typeof messages === 'object' && 'messages' in messages) {
      messages = messages.messages;
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No valid messages provided.', received: messages },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content) {
      return NextResponse.json(
        { error: 'Last message is missing content.', received: lastMessage },
        { status: 400 }
      );
    }

    let context = '';
    let references: { fileName?: string; pageNumber?: number }[] = [];

    if (chatId && lastMessage.content && boardID) {
      try {
        console.log('Generating embedding for:', lastMessage.content);

        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: lastMessage.content,
        });

        const embedding = embeddingResponse.data[0]?.embedding;
        if (!embedding) throw new Error('Failed to generate embedding.');

        const vector = {
          id: nanoid(),
          values: embedding, // Fix: Use embedding instead of embeds.data[0].embedding
          metadata: {
            boardId: boardID,
            chatId,
            // These variables need to be defined or removed if not needed
            // fileId, 
            // fileName,
            // pageNumber,
            content: lastMessage.content, // Fix: Use lastMessage.content instead of chunk.pageContent
          },
        };

        // Filter condition update
        const queryResponse = await dbindex.query({
          vector: embedding,
          topK: 5,
          includeMetadata: true,
          filter: { boardId: { $eq: boardID } },  // Changed to match metadata key
        });

        if (queryResponse.matches.length > 0) {
          const matchesWithMetadata = queryResponse.matches.filter(
            (match) => match.metadata !== undefined
          );
        
          context = matchesWithMetadata
            .map((match) => match.metadata!.content)
            .join('\n\n');
        
          references = matchesWithMetadata.map((match) => ({
            fileName: String(match.metadata!.fileName),
            pageNumber: Number(match.metadata!.pageNumber),
          }));
        }
        
        
        console.log('Retrieved context:', context);
      } catch (error) {
        console.error('Error fetching embeddings or context:', error);
      }
    }

    const promptText = context ? `${context}\n\n${lastMessage.content}` : lastMessage.content;
    console.log('Final prompt for AI:', promptText);

    const result = await streamText({
      model: groq('gemma2-9b-it'),
      prompt: promptText,
    });

    let streamedText = '';
    for await (const textPart of result.textStream) {
      streamedText += textPart;
    }

    console.log('Generated response:', streamedText);
    console.log('Token usage:', await result.usage);
    console.log('Finish reason:', await result.finishReason);

    // Return formatted response compatible with useChat hook
    return NextResponse.json({
      id: nanoid(),
      role: 'assistant',
      content: streamedText,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
