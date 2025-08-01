import { connectDB } from "@/lib/mongodb";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";


export async function GET(){
    await connectDB();

    const matieres = await Matiere_Premiere.find();

    return NextResponse.json({matieres}, { status: 200});
}

export async function POST(request){
    await connectDB();

    const { nom, reference, unite, quantite, fournisseur } = await request.json();
    await Matiere_Premiere.create({ nom, reference, unite, quantite, fournisseur });

    return NextResponse.json({message: "Matiere Premiere created"}, {status: 201});
}