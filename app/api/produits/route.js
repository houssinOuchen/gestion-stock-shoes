import { connectDB } from "@/lib/mongodb";
import Produit from "@/models/Produit";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB();

    const prods = await Produit.find();
    return NextResponse.json({prods}, {status: 200});
}

export async function POST(request){
    await connectDB();

    const { reference, type, genre, pointure, couleur, quantite } = await request.json();
    await Produit.create({ reference, type, genre, pointure, couleur, quantite });

    return NextResponse.json({message: "Product Created"}, {status: 201});
}
