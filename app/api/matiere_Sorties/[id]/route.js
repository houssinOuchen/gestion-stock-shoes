import { connectDB } from "@/lib/mongodb";
import Matiere_Sortie from "@/models/Matiere_Sortie";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;
    const sortie = await Matiere_Sortie.findById(id).populate("matiere_id");

    return NextResponse.json({ sortie }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { matiere_id, quantite, date, utiliser_production } = await request.json();

    const { id } = await params;
     const old = await Matiere_Sortie.findById(id);
    if (!old) return NextResponse.json({ error: "Sortie not found" }, { status: 404 });

    const diff = quantite - old.quantite;

    await Matiere_Sortie.findByIdAndUpdate(id, {
        matiere_id, quantite, date, utiliser_production
    });

    await Matiere_Premiere.findByIdAndUpdate(matiere_id, {
        $inc: { quantite: -diff }
    });

    return NextResponse.json({ message: "Matiere sortie updated" }, { status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;
    const old = await Matiere_Sortie.findById(id);
    if (!old) return NextResponse.json({ error: "Sortie not found" }, { status: 404 });

    await Matiere_Sortie.findByIdAndDelete(params.id);

    await Matiere_Premiere.findByIdAndUpdate(old.matiere_id, {
        $inc: { quantite: old.quantite }
    });

    return NextResponse.json({ message: "Matiere sortie deleted" }, { status: 201 });
}
