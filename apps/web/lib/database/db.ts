import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Pinecone } from '@pinecone-database/pinecone';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// PostgreSQL for relational data
export const db = drizzle(pool);

// Pinecone for vector database
export const pinecone = new Pinecone({
  apiKey : process.env.PINECONE_API_KEY!
});

export const dbindex = pinecone.index(process.env.PINECONE_INDEX_NAME!, process.env.PINECONE_HOST);
