import mongoose from "mongoose";

const productionSchema = new mongoose.Schema({
    produit_id: {type: mongoose.Schema.Types.ObjectId,required: true, ref: 'Produit'},
    quantite: {type: Number, required: true},
    date: {type: Date, required: true},
},{
    timestamps: true
})

export default mongoose.models.Production || mongoose.model('Production', productionSchema)