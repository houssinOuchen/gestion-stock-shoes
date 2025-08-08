import { connectDB } from "@/lib/mongodb";
import Matiere_Sortie from "@/models/Matiere_Sortie";
import Matiere_Premiere from "@/models/Matiere_Premiere";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();

    const sorties = await Matiere_Sortie.find().populate("matiere_id");

    return NextResponse.json({ sorties }, { status: 200 });
}

export async function POST(request) {
    await connectDB();

    try {
        const { matiere_id, quantite, date, utiliser_production } = await request.json();
        await Matiere_Sortie.create({ matiere_id, quantite, date, utiliser_production });

        await Matiere_Premiere.findByIdAndUpdate(matiere_id, {
            $inc: { quantite: -quantite }
        });

        return NextResponse.json({ message: "Matiere sortie created" }, { status: 201 });
    } catch (err) {
        console.error("Server error:", err);
        
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
