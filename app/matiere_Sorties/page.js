"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Save, X, Edit, Trash2, AlertCircle, TrendingDown, Calendar, Factory } from "lucide-react"


export default function MatiereSortiePage({  }) {
    const [matiere_Prem, setMatiere_Prem] = useState([]);
    const [sorties, setSorties] = useState([]);
    const [form, setForm] = useState({ matiere_id: '', quantite: '', date: '', utiliser_production: false });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchMatieres_Sorties();
        fetchMatieres_Premiere();
    }, []);

    const fetchMatieres_Premiere = async () => {
        const res = await fetch("/api/matieres_Premieres");
        const data = await res.json();
        setMatiere_Prem(data.matieres || []);
    };

    const fetchMatieres_Sorties = async () => {
        const res = await fetch("/api/matiere_Sorties");
        const data = await res.json();
        setSorties(data.sorties || []);
    }

    const ValidateForm = () => {
        const newErrors = {};
        if (!form.matiere_id) newErrors.matiere_id = 'la matiere est requise';
        if (!form.quantite) newErrors.quantite = 'la quantite est requise';
        if (!form.date) newErrors.date = 'la date est requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!ValidateForm()) return;

        try {
            const res = await fetch(editId ? `/api/matiere_Sorties/${editId}` : "/api/matiere_Sorties", {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    matiere_id: form.matiere_id,
                    quantite: parseInt(form.quantite),
                    date: form.date,
                    utiliser_production: form.utiliser_production
                })
            });

            if (!res.ok) {
                const data = await res.json();
                setErrors({ general: data.error || 'Erreur inconnue' });
                return;
            }

            setForm({ matiere_id: '', quantite: '', date: '', utiliser_production: false })
            fetchMatieres_Sorties();
            fetchMatieres_Premiere();
            setErrors({});
            setEditId(null);
        } catch (err) {
            setErrors({ general: 'Erreur réseau' });
        }
    };

    const cancelEdit = () => {
        setForm({ matiere_id: '', quantite: '', date: '', utiliser_production: false })
        setEditId(null)
        setErrors({})
    }

    const handleEdit = (mat) => {
        setForm({ matiere_id: mat.matiere_id._id, quantite: mat.quantite, date: mat.date?.slice(0, 10), utiliser_production: mat.utiliser_production });
        setErrors({});
        setEditId(mat._id);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/matiere_Sorties/${id}`, { method: 'DELETE' });

            fetchMatieres_Sorties();
            fetchMatieres_Premiere();
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    return (
        <div className="mx-auto px-6 my-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Factory className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Sorties de la Matière Première</h1>
                    <p className="text-muted-foreground">Gérez votre stock de matières premières et fournisseurs</p>
                </div>
            </div>

            {/* Add/Edit Exit Form */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {editId ? <Edit className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                            {editId ? "Modifier la sortie de matière" : "Nouvelle Sortie de Matière"}
                        </CardTitle>
                        <CardDescription>
                            {editId
                                ? "Modifiez les informations de la sortie de matière première"
                                : "Enregistrez une nouvelle sortie de matière première de votre stock"}
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
                                        placeholder="Ex: 25"
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
                                    <Label htmlFor="date">Date de sortie</Label>
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
                                <div className="space-y-2 md:col-span-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="utiliser_production"
                                            checked={form.utiliser_production}
                                            onCheckedChange={(checked) => setForm({ ...form, utiliser_production: checked })}
                                        />
                                        <Label htmlFor="utiliser_production" className="flex items-center gap-2">
                                            <Factory className="h-4 w-4" />
                                            Utiliser pour la production
                                        </Label>
                                    </div>
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

            {/* Exits List */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5" />
                            Liste des Sorties de Matières
                        </CardTitle>
                        <CardDescription>Historique des sorties de matières premières de votre stock</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sorties?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Aucune sortie de matière trouvée</p>
                                <p className="text-sm">Commencez par enregistrer votre première sortie</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Matière</TableHead>
                                            <TableHead>Quantité</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Usage Production</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sorties?.map((s) => (
                                            <TableRow key={s._id}>
                                                <TableCell>
                                                    <code className="bg-muted px-2 py-1 rounded text-sm">{s.matiere_id?.reference}</code>
                                                </TableCell>
                                                <TableCell className="font-medium">{s.quantite}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {s.date?.slice(0, 10)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={s.utiliser_production ? "default" : "secondary"}>
                                                        {s.utiliser_production ? "Oui" : "Non"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(s)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(s._id)}
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
//             <select className="border p-2 mb-2" value={form.matiere_id} onChange={(e) => setForm({ ...form, matiere_id: e.target.value })} >
//                 <option value="">-- Choisir une matière --</option>
//                 {matiere_Prem.map((m) => (
//                     <option key={m._id} value={m._id}>
//                         {m.nom} ({m.quantite} unités)
//                     </option>
//                 ))}
//             </select>
//             {errors.matiere_id && <p className="text-red-600">{errors.matiere_id}</p>}
//         </div>
//         <div>
//             <label>Quantité</label>
//             <input
//                 type="number"
//                 placeholder="Quantité"
//                 value={form.quantite}
//                 onChange={(e) => setForm({ ...form, quantite: e.target.value })}
//                 className="border p-2 mb-2 block"
//             />
//             {errors.quantite && <p className="text-red-600">{errors.quantite}</p>}
//         </div>
//         <div>
//             <label>Date</label>
//             <input
//                 type="date"
//                 value={form.date}
//                 onChange={(e) => setForm({ ...form, date: e.target.value })}
//                 className="border p-2 mb-2 block"
//             />
//             {errors.date && <p className="text-red-600">{errors.date}</p>}
//         </div>
//         <div>
//             <label>utiliser poue production</label>
//             <input
//                 type="checkbox"
//                 checked={form.utiliser_production}
//                 onChange={(e) => setForm({ ...form, utiliser_production: e.target.checked })}
//                 className="border p-2 mb-2 block"
//             />
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
//     <h3 className="mt-8 mb-2 font-semibold">Liste de Matieres Sorities</h3>
//     <table className="w-full border mt-2">
//         <thead>
//             <tr className="bg-gray-100">
//                 <th className="border px-2 py-1">Matiere</th>
//                 <th className="border px-2 py-1">Quantité</th>
//                 <th className="border px-2 py-1">Date</th>
//                 <th className="border px-2 py-1">utiliser pour production</th>
//                 <th className="border px-2 py-1">Actions</th>
//             </tr>
//         </thead>
//         <tbody>
//             {sorties?.map((s) => (
//                 <tr key={s._id}>
//                     <td className="border px-2 py-1">{s.matiere_id?.reference}</td>
//                     <td className="border px-2 py-1">{s.quantite}</td>
//                     <td className="border px-2 py-1">{s.date?.slice(0, 10)}</td>
//                     <td className="border px-2 py-1">{s.utiliser_production ? 'true' : 'false'}</td>
//                     <td className="border px-2 py-1 space-x-2">
//                         <button onClick={() => handleEdit(s)} className="text-blue-600">Edit</button>
//                         <button onClick={() => handleDelete(s._id)} className="text-red-600">Delete</button>
//                     </td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// </div>