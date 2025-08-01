import { connectDB } from "@/lib/mongodb";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    await connectDB();

    const { id } = await params;
    const Material = await Matiere_Premiere.findOne({ _id: id });

    return NextResponse.json({ Material }, { status: 200 });
}

export async function PUT(request, { params }) {
    await connectDB();

    const { id } = await params;
    const { nom: nom, reference: reference, unite: unite, quantite: quantite, fournisseur: fournisseur } = await request.json();
    await Matiere_Premiere.findByIdAndUpdate(id, { nom, reference, unite, quantite, fournisseur })

    return NextResponse.json({ message: 'Material updated' }, { status: 201 });
}

export async function DELETE(request, { params }) {
    await connectDB();

    const { id } = await params;;
    await Matiere_Premiere.findByIdAndDelete(id);

    return NextResponse.json({ message: 'material deleted' }, { status: 201 });
}