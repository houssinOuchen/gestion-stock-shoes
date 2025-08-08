import { connectDB } from "@/lib/mongodb";
import Matiere_Entree from "@/models/Matiere_Entree";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await connectDB();
    
    const { id } = await params;
    const entree = await Matiere_Entree.findById(id).populate("matiere_id");

    return NextResponse.json({ entree }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { matiere_id, quantite, date, prix_unite, fournisseur } = await request.json();

    const { id } = await params;
    const old = await Matiere_Entree.findById(id);
    if (!old) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    const diff = quantite - old.quantite;

    await Matiere_Entree.findByIdAndUpdate(params.id, { matiere_id, quantite, date, prix_unite, fournisseur });

    await Matiere_Premiere.findByIdAndUpdate(matiere_id, {
        $inc: { quantite: diff }
    });

    return NextResponse.json({ message: "Matiere entree updated" }, { status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;
    const old = await Matiere_Entree.findById(id);
    if (!old) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    await Matiere_Entree.findByIdAndDelete(params.id);

    await Matiere_Premiere.findByIdAndUpdate(old.matiere_id, {
        $inc: { quantite: -old.quantite }
    });


    return NextResponse.json({ message: "Matiere entree deleted" }, { status: 201 });
}
