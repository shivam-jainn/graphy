import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database/db'
import { resources } from '@/lib/database/schemas/resources-schema'
import { embeddings } from '@/lib/database/schemas/embedding-schema'
import { nanoid } from '@/lib/utils'
import OpenAI from 'openai'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const url = formData.get('url') as string

    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      )
    }

    // Create resource record
    const resourceId = nanoid()
    await db.insert(resources).values({
      id: resourceId,
      type: 'webpage',
      path: url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    // Scrape and process web content
    const loader = new CheerioWebBaseLoader(url)
    const docs = await loader.load()

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })
    const chunks = await splitter.splitDocuments(docs)

    for (const chunk of chunks) {
      const { data: [{ embedding }] } = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk.pageContent,
      })

      await db.insert(embeddings).values({
        id: nanoid(),
        resourceId: resourceId,
        content: chunk.pageContent,
        embedding: embedding,
      })
    }
    
    return NextResponse.json({
      success: true,
      resourceId
    })

  } catch (error) {
    console.error('[WEB_UPLOAD_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to process webpage' },
      { status: 500 }
    )
  }
}