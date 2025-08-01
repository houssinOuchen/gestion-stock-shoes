import { connectDB } from "@/lib/mongodb";
import Produit from "@/models/Produit";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;
    const product = await Produit.findOne({ _id: id });

    return NextResponse.json({ product }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { id } = await params
    const { reference: reference, type: type, genre: genre, pointure: pointure, couleur: couleur, quantite: quantite } = await request.json();
    await Produit.findByIdAndUpdate(id, { reference, type, genre, pointure, couleur, quantite });

    return NextResponse.json({ message: 'Product updated' }, { status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;
    await Produit.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Product deleted' }, { status: 201 })
}