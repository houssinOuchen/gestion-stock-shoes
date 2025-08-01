import mongoose from "mongoose";

const matiere_premiereSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    reference: { type: String, required: true },
    unite: { type: String, required: true },
    quantite: { type: Number, required: true },
    fournisseur: { type: String, required: true },
},{
        timestamps: true
})

export default mongoose.models.Matiere_Premiere || mongoose.model("Matiere_Premiere", matiere_premiereSchema)