import { connectDB } from "@/lib/mongodb";
import Production from "@/models/Production";
import Produit from "@/models/Produit";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;
    const production = await Production.findById(id).populate("produit_id");

    return NextResponse.json({ production }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { id } = await params;
    const { produit_id, quantite, date } = await request.json();

    const oldProduction = await Production.findById(id);
    if (!oldProduction) {
        return NextResponse.json({ error: "Production not found" }, { status: 404 });
    }

    await Production.findByIdAndUpdate(id, { produit_id, quantite, date });

    const quantityDiff = quantite - oldProduction.quantite;

    await Produit.findByIdAndUpdate(
        produit_id,
        { $inc: { quantite: quantityDiff } }
    );

    return NextResponse.json({ message: 'Production updated' }, { status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;

    const production = await Production.findById(id);
    if (!production) {
        return NextResponse.json({ error: "Production not found" }, { status: 404 });
    }

    await Produit.findByIdAndUpdate(
        production.produit_id,
        { $inc: { quantite: -production.quantite } }
    );

    await Production.findByIdAndDelete(id);

    return NextResponse.json({ message: "Production deleted" }, { status: 201 });
}
