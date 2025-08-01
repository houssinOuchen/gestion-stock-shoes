import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function GET() {
    await connectDB();

    const users = await User.find()
    return NextResponse.json({ users }, { status: 200 });
}

export async function POST(request) {
    await connectDB()

    try {
        const { username, email, password, acces } = await request.json();
        const hashedPwd = await bcrypt.hash(password, 10);

        await User.create({ username, email, password: hashedPwd, acces });
        
        return NextResponse.json({ message: "user created" }, { status: 201 });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern?.email) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }

        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }


   
}

