import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;
    const user = await User.findOne({ _id: id });

    return NextResponse.json({ user }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { id } = await params;
    const { username, email, password, acces } = await request.json();

    const updateUser = {
        username,
        email,
        acces
    }

    if (password && password.trim() !== '') {
        const hashedPasswd = await bcrypt.hash(password, 10)
        updateUser.password = hashedPasswd;
    }


    await User.findByIdAndUpdate(id, updateUser);

    return NextResponse.json({ message: 'user Updated', status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "user deleted" }, { status: 201 });
}