import mongoose from "mongoose";

const matiere_sortieSchema = new mongoose.Schema({
    matiere_id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Matiere_Premiere'},
    quantite: {type: Number, required: true},
    date: {type: Date, required: true},
    utiliser_production: {type: Boolean, required: true},
},{
    timestamps:true
})

export default mongoose.models.Matiere_Sortie || mongoose.model("Matiere_Sortie", matiere_sortieSchema)