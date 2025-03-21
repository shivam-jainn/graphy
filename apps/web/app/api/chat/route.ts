import { groq } from '@ai-sdk/groq';
import { streamText, embed } from 'ai';
import { dbindex } from '@/lib/database/db';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));

    let { messages, chatId } = body;

    // Ensure messages is an array (fixing the nested structure issue)
    if (messages && typeof messages === 'object' && 'messages' in messages) {
      messages = messages.messages; // Extract actual messages array
    }

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages array:', messages);
      return NextResponse.json(
        { error: 'No valid messages provided.', received: messages },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];

    // Validate last message
    if (!lastMessage?.content) {
      console.error('Last message is missing content:', lastMessage);
      return NextResponse.json(
        { error: 'Last message is missing content.', received: lastMessage },
        { status: 400 }
      );
    }

    let context = '';

    // Fetch context using embedding if chatId is provided
    if (chatId && lastMessage.content) {
      try {
        console.log('Generating embedding for:', lastMessage.content);

        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: lastMessage.content,
        });

        const embedding = embeddingResponse.data[0]?.embedding;
        if (!embedding) {
          throw new Error('Failed to generate embedding.');
        }

        const queryResponse = await dbindex.query({
          vector: embedding,
          topK: 5,
          includeMetadata: true,
          filter: { chatId: { $eq: chatId } },
        });

        context = queryResponse.matches.length > 0
          ? queryResponse.matches.map((match) => match.metadata.content).join('\n\n')
          : '';

        console.log('Retrieved context:', context);
      } catch (error) {
        console.error('Error fetching embeddings or context:', error);
      }
    }

    // Create the prompt
    const promptText = context ? `${context}\n\n${lastMessage.content}` : lastMessage.content;
    console.log('Final prompt for AI:', promptText);

    // Generate response using Groq model
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

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
