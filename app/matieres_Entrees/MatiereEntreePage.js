"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Factory, Plus, Save, X, Edit, Trash2, AlertCircle, TrendingUp, Calendar, DollarSign, Building2 } from "lucide-react"


export default function MatiereSortiePage({ refreshMatiere }) {
    const [matiere_Prem, setMatiere_Prem] = useState([]);
    const [entrees, setEntrees] = useState([]);
    const [form, setForm] = useState({ matiere_id: '', quantite: '', date: '', prix_unite: '', fournisseur: '' });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchMatieres_Premiere();
        fetchMatieres_Entrees();
    }, []);

    const fetchMatieres_Premiere = async () => {
        const res = await fetch("/api/matieres_Premieres");
        const data = await res.json();
        setMatiere_Prem(data.matieres);
    };

    const fetchMatieres_Entrees = async () => {
        const res = await fetch("/api/matieres_Entrees");
        const data = await res.json();
        setEntrees(data.entrees);
    };

    const ValidateForm = () => {
        const newErrors = {};
        if (!form.matiere_id) newErrors.matiere_id = 'la matiere est requise';
        if (!form.quantite) newErrors.quantite = 'la quantite est requise';
        if (!form.date) newErrors.date = 'la date est requise';
        if (!form.prix_unite) newErrors.prix_unite = 'le prix est requise';
        if (!form.fournisseur) newErrors.fournisseur = 'le fournisseur est requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ValidateForm()) return;

        try {
            const res = await fetch(editId ? `/api/matieres_Entrees/${editId}` : "/api/matieres_Entrees", {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matiere_id: form.matiere_id,
                    quantite: parseInt(form.quantite),
                    date: form.date,
                    prix_unite: form.prix_unite,
                    fournisseur: form.fournisseur
                })
            });

            refreshMatiere();
            if (!res.ok) {
                const data = await res.json();
                setErrors({ general: data.error || 'Erreur inconnue' });
                return;
            }

            setForm({ matiere_id: '', quantite: '', date: '', prix_unite: '', fournisseur: '' })
            fetchMatieres_Premiere();
            fetchMatieres_Entrees();
            setErrors({});
            setEditId(null);
        } catch (err) {
            setErrors({ general: 'Erreur réseau' });
        }

    };

    const cancelEdit = () => {
        setForm({ matiere_id: '', quantite: '', date: '', prix_unite: '', fournisseur: '' })
        setEditId(null)
        setErrors({})
    }

    const handleEdit = (mat) => {
        setForm({ matiere_id: mat.matiere_id._id, quantite: mat.quantite, date: mat.date?.slice(0, 10), prix_unite: mat.prix_unite, fournisseur: mat.fournisseur });
        setErrors({});
        setEditId(mat._id);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/matieres_Entrees/${id}`, { method: 'DELETE' });

            refreshMatiere();
            fetchMatieres_Entrees();
            fetchMatieres_Premiere();
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    return (
        <div className="my-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Factory className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Entrées de la Matière Première</h1>
                    <p className="text-muted-foreground">Gérez votre stock de matières premières et fournisseurs</p>
                </div>
            </div>

            {/* Add/Edit Entry Form */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {editId ? <Edit className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                            {editId ? "Modifier l'entrée de matière" : "Nouvelle Entrée de Matière"}
                        </CardTitle>
                        <CardDescription>
                            {editId
                                ? "Modifiez les informations de l'entrée de matière première"
                                : "Enregistrez une nouvelle entrée de matière première dans votre stock"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="matiere">Matière Première</Label>
                                    <Select value={form.matiere_id} onValueChange={(value) => setForm({ ...form, matiere_id: value })}>
                                        <SelectTrigger className={errors.matiere_id ? "border-red-500" : ""}>
                                            <SelectValue placeholder="-- Choisir une matière --" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {matiere_Prem.map((m) => (
                                                <SelectItem key={m._id} value={m._id}>
                                                    {m.nom} ({m.quantite} unités)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.matiere_id && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.matiere_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantite">Quantité</Label>
                                    <Input
                                        id="quantite"
                                        type="number"
                                        placeholder="Ex: 50"
                                        value={form.quantite}
                                        onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                                        className={errors.quantite ? "border-red-500" : ""}
                                    />
                                    {errors.quantite && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.quantite}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date d'entrée</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className={errors.date ? "border-red-500" : ""}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.date}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prix_unite">Prix unitaire</Label>
                                    <Input
                                        id="prix_unite"
                                        type="text"
                                        placeholder="Ex: 25.50"
                                        value={form.prix_unite}
                                        onChange={(e) => setForm({ ...form, prix_unite: e.target.value })}
                                        className={errors.prix_unite ? "border-red-500" : ""}
                                    />
                                    {errors.prix_unite && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.prix_unite}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="fournisseur">Fournisseur</Label>
                                    <Input
                                        id="fournisseur"
                                        type="text"
                                        placeholder="Ex: Société XYZ"
                                        value={form.fournisseur}
                                        onChange={(e) => setForm({ ...form, fournisseur: e.target.value })}
                                        className={errors.fournisseur ? "border-red-500" : ""}
                                    />
                                    {errors.fournisseur && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.fournisseur}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {errors.general && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.general}</AlertDescription>
                                </Alert>
                            )}
                            <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex items-center gap-2">
                                    {editId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    {editId ? "Modifier" : "Ajouter"}
                                </Button>
                                {editId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelEdit}
                                        className="flex items-center gap-2 bg-transparent"
                                    >
                                        <X className="h-4 w-4" />
                                        Annuler
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Entries List */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Liste des Entrées de Matières
                        </CardTitle>
                        <CardDescription>Historique des entrées de matières premières dans votre stock</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {entrees?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Aucune entrée de matière trouvée</p>
                                <p className="text-sm">Commencez par enregistrer votre première entrée</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Matière</TableHead>
                                            <TableHead>Quantité</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Prix Unitaire</TableHead>
                                            <TableHead>Fournisseur</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entrees?.map((e) => (
                                            <TableRow key={e._id}>
                                                <TableCell>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">{e.matiere_id?.reference}</code>
                                                </TableCell>
                                                <TableCell className="font-medium">{e.quantite}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {e.date?.slice(0, 10)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                        {e.prix_unite}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        {e.fournisseur}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(e)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(e._id)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
//<div>
//     <h2 className="text-xl font-bold mb-4">➖ Nouvelle Matière Sortie</h2>
//     <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//             <label>Matière</label><br></br>
//             <select
//                 className="border p-2 mb-2"
//                 value={form.matiere_id}
//                 onChange={(e) => setForm({ ...form, matiere_id: e.target.value})} >

//                 <option value="">-- Choisir une matière --</option>
//                 {matiere_Prem.map((m) => (
//                     <option key={m._id} value={m._id}>
//                         {m.nom} ({m.quantite} unités)
//                     </option>
//                 ))}
//             </select>
//             {errors.matiere_id && <p className="text-red-600">{errors.m}</p>}

//         </div>
//         <div>
//             <label>Quantité</label>
//             <input
//                 type="number"
//                 placeholder="Quantité"
//                 value={form.quantite}
//                 onChange={(e) => setForm({ ...form, quantite: e.target.value})}
//                 className="border p-2 mb-2 block" />
//             {errors.quantite && <p className="text-red-600">{errors.quantite}</p>}

//         </div>
//         <div>
//             <label>Date</label>
//             <input
//                 type="date"
//                 value={form.date}
//                 onChange={(e) => setForm({ ...form, date: e.target.value})}
//                 className="border p-2 mb-2 block" />
//             {errors.date && <p className="text-red-600">{errors.date}</p>}
//         </div>

//         <div>
//             <label>prix unite</label>
//             <input
//                 type="text"
//                 value={form.prix_unite}
//                 onChange={(e) => setForm({ ...form, prix_unite: e.target.value})}
//                 className="border p-2 mb-2 block" />
//             {errors.prix_unite && <p className="text-red-600">{errors.prix_unite}</p>}
//         </div>

//         <div>
//             <label>Fournisseur</label>
//             <input
//                 type="text"
//                 value={form.fournisseur}
//                 onChange={(e) => setForm({ ...form, fournisseur: e.target.value})}
//                 className="border p-2 mb-2 block" />
//             {errors.fournisseur && <p className="text-red-600">{errors.fournisseur}</p>}
//         </div>

//         <div className="flex space-x-2">
//             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//                 {editId ? 'Modifier' : 'Ajouter'}
//             </button>
//             {editId && (
//                 <button type="button" onClick={cancelEdit} className="bg-gray-400 px-4 py-2 rounded">
//                     Annuler
//                 </button>
//             )}
//         </div>
//         {errors.general && <p className="text-red-600">{errors.general}</p>}
//     </form>

//     <h3 className="mt-8 mb-2 font-semibold">Liste de Matieres Entrees</h3>
//     <table className="w-full border mt-2">
//         <thead>
//             <tr className="bg-gray-100">
//                 <th className="border px-2 py-1">Matiere</th>
//                 <th className="border px-2 py-1">Quantité</th>
//                 <th className="border px-2 py-1">Date</th>
//                 <th className="border px-2 py-1">Prix Unite</th>
//                 <th className="border px-2 py-1">Fournisseur</th>
//                 <th className="border px-2 py-1">Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {entrees?.map((e) => (
//                 <tr key={e._id}>
//                     <td className="border px-2 py-1">{e.matiere_id?.reference}</td>
//                     <td className="border px-2 py-1">{e.quantite}</td>
//                     <td className="border px-2 py-1">{e.date?.slice(0, 10)}</td>
//                     <td className="border px-2 py-1">{e.prix_unite }</td>
//                     <td className="border px-2 py-1">{e.fournisseur }</td>
//                     <td className="border px-2 py-1 space-x-2">
//                         <button onClick={() => handleEdit(e)} className="text-blue-600">Edit</button>
//                         <button onClick={() => handleDelete(e._id)} className="text-red-600">Delete</button>
//                     </td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// </div>