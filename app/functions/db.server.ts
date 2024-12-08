import { MongoClient } from 'mongodb';

// need .env for this to work so we are not sharing our connection string
const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    throw new Error('MIssing Connecection String!');
}

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