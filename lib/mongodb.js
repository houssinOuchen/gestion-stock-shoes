import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let isConnected = false;

export const connectDB = async () => {

if (isConnected) return
    try {
        await mongoose.connect(DATABASE_URL, { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        isConnected = true
        console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error)
  }
}

