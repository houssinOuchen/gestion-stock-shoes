import mongoose from "mongoose";

const produitSchema = new mongoose.Schema({
    reference: {type: String, required: true},
    type: {
        type: String,
        enum: ["CHAUSSURE", "BASKETS", "ESPADRILLES", "SANDALES", "CLAQUETTES" ],
        required: true
    },
    genre: {
        type: String,
        enum: ["HOMME", "FEMME", "GARÇON", "FILLE"],
        required: true
    },
    pointure: {type: String, required: true},
    couleur: {type: String, required: true},
    quantite: {type: Number, required: true},
},{
    timestamps: true
})

export default mongoose.models.Produit || mongoose.model('Produit', produitSchema)