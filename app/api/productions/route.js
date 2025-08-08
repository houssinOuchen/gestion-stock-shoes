import { connectDB } from "@/lib/mongodb";
import Production from "@/models/Production";
import Produit from "@/models/Produit";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    const productions = await Production.find().populate("produit_id");
    return NextResponse.json({ productions }, { status: 200 });
}

export async function POST(request) {
    await connectDB();

    try {
        const { produit_id, quantite, date } = await request.json();

        await Production.create({ produit_id, quantite, date });

        await Produit.findByIdAndUpdate(
            produit_id,
            { $inc: { quantite: quantite } }
        );

        return NextResponse.json({ message: "Production created" }, { status: 201 });
    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
