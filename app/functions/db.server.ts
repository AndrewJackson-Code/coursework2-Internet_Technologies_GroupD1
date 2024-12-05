// app/functions/db.server.ts
import { MongoClient } from 'mongodb';

// Access the environment variable
const connectionString = process.env.MONGODB_URI;

// Check if the connection string exists
if (!connectionString) {
    throw new Error('MIssing Connecection String!');
}

// Create a MongoClient instance
const client = new MongoClient(connectionString);

export async function connectDb() {
    try {
        await client.connect();
        const db = client.db('userData');
        return { db, client };
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

export async function getUsersCollection() {
    const { db } = await connectDb();
    return db.collection('users');
}