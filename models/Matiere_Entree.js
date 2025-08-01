import mongoose from "mongoose";

const matiere_entreeSchema = new mongoose.Schema({
    matiere_id: {type: mongoose.Schema.Types.ObjectId,required: true, ref: 'Matiere_Premiere'},
    quantite: {type: Number, required: true},
    date: {type: Date, required: true},
    prix_unite:{type: Number, required: true},
    fournisseur: {type: String, required: true},
},{
    timestamps:true
})

export default mongoose.models.Matiere_Entree || mongoose.model('Matiere_Entree', matiere_entreeSchema)