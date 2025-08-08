import { connectDB } from "@/lib/mongodb";
import Matiere_Entree from "@/models/Matiere_Entree";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    const entrees = await Matiere_Entree.find().populate("matiere_id");
    
    return NextResponse.json({ entrees }, { status: 200 });
}

export async function POST(request) {
    await connectDB();

    try {
        const { matiere_id, quantite, date, prix_unite, fournisseur } = await request.json();
        await Matiere_Entree.create({ matiere_id, quantite, date, prix_unite, fournisseur });

        await Matiere_Premiere.findByIdAndUpdate(matiere_id, {
            $inc: { quantite: quantite }
        });

        return NextResponse.json({ message: "Matiere entree created" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
