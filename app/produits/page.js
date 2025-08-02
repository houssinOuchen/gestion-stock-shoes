'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Save, X, Edit, Trash2, AlertCircle } from "lucide-react"


export default function ProductsPage() {
    const { data: session, status } = useSession();
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ reference: '', type: '', genre: '', pointure: '', couleur: '', quantite: '' });
    const [errors, setErrors] = useState({});
    const [editProdId, setEditProdId] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (status == 'unauthenticated') {
            router.push('/login');
        }
    }, [status])

    useEffect(() => {
        fetch('/api/produits')
            .then(res => res.json())
            .then(data => setProducts(data.prods))
        console.log('prod: ', products);
    }, []);

    const refreshProducts = async () => {
        const res = await fetch('/api/produits');
        const data = await res.json();
        setProducts(data.prods);
        console.log('prod 2: ', products);
    }

    function validateForm() {
        const newErrors = {}

        if (!form.reference) newErrors.reference = 'La Reference du produit est requis!';
        if (!form.type) newErrors.type = 'Le Type du produit est requis!';
        if (!form.genre) newErrors.genre = 'Le Genre du produit est requis!';
        if (!form.pointure) newErrors.pointure = 'La Pointure du produit est requis!';
        if (!form.couleur) newErrors.couleur = 'La Couleur du produit est requis!';
        if (!form.quantite) newErrors.quantite = 'La Quantite du produit est requis!';

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return;
        try {
            const res = await fetch(editProdId ? `/api/produits/${editProdId}` : '/api/produits', {
                method: editProdId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) {
                setErrors({ general: data.error || 'Something went wrong!' })
                return;
            }

            setForm({ reference: '', type: '', genre: '', pointure: '', couleur: '', quantite: '' })
            setEditProdId(null)
            setErrors({})
            refreshProducts();
        } catch (err) {
            console.error('Error submitting form:', err);
            setErrors({ general: 'Failed to submit form. Please try again.' });
        }

    }

    const editProduct = (prod) => {
        setForm({
            reference: prod.reference,
            type: prod.type,
            genre: prod.genre,
            pointure: prod.pointure,
            couleur: prod.couleur,
            quantite: prod.quantite,
        })

        setEditProdId(prod._id)
        setErrors({})
    }

    const cancelEdit = () => {
        setForm({
            reference: '',
            type: '',
            genre: '',
            pointure: '',
            couleur: '',
            quantite: '',
        })

        setEditProdId(null)
        setErrors({})
    }

    const deleteProduct = async (id) => {
        try {
            await fetch(`api/produits/${id}`, {
                method: 'DELETE',
            })
        } catch (err) {
            console.log('error in deleteProduct() method:', err)
        } finally {
            refreshProducts();
        }

    }

    const getTypeBadgeVariant = (type) => {
        switch (type) {
            case "CHAUSSURE":
                return "default"
            case "BASKETS":
                return "secondary"
            case "ESPADRILLES":
                return "outline"
            case "SANDALES":
                return "destructive"
            case "CLAQUETTES":
                return "default"
            default:
                return "default"
        }
    }

    const getGenreBadgeVariant = (genre) => {
        switch (genre) {
            case "HOMME":
                return "default"
            case "FEMME":
                return "secondary"
            case "GARÇON":
                return "outline"
            case "FILLE":
                return "destructive"
            default:
                return "default"
        }
    }

    const getStockStatus = (quantite) => {
        const qty = Number.parseInt(quantite)
        if (qty === 0) return { variant: "destructive", text: "Rupture" }
        if (qty < 5) return { variant: "secondary", text: "Stock faible" }
        return { variant: "default", text: "En stock" }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Produits</h1>
                    <p className="text-muted-foreground">Gérez votre inventaire de chaussures et accessoires</p>
                </div>
            </div>

            {/* Add/Edit Product Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {editProdId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        {editProdId ? "Modifier le produit" : "Ajouter un produit"}
                    </CardTitle>
                    <CardDescription>
                        {editProdId ? "Modifiez les informations du produit" : "Ajoutez un nouveau produit à votre inventaire"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="reference">Référence</Label>
                                <Input
                                    id="reference"
                                    placeholder="Ex: REF-001"
                                    value={form.reference}
                                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                                    className={errors.reference ? "border-red-500" : ""}
                                />
                                {errors.reference && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.reference}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type de produit</Label>
                                <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                                    <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CHAUSSURE">Chaussure</SelectItem>
                                        <SelectItem value="BASKETS">Baskets</SelectItem>
                                        <SelectItem value="ESPADRILLES">Espadrilles</SelectItem>
                                        <SelectItem value="SANDALES">Sandales</SelectItem>
                                        <SelectItem value="CLAQUETTES">Claquettes</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="genre">Genre</Label>
                                <Select value={form.genre} onValueChange={(value) => setForm({ ...form, genre: value })}>
                                    <SelectTrigger className={errors.genre ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Sélectionnez un genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HOMME">Homme</SelectItem>
                                        <SelectItem value="FEMME">Femme</SelectItem>
                                        <SelectItem value="GARÇON">Garçon</SelectItem>
                                        <SelectItem value="FILLE">Fille</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.genre && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.genre}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pointure">Pointure</Label>
                                <Input
                                    id="pointure"
                                    placeholder="Ex: 42"
                                    value={form.pointure}
                                    onChange={(e) => setForm({ ...form, pointure: e.target.value })}
                                    className={errors.pointure ? "border-red-500" : ""}
                                />
                                {errors.pointure && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.pointure}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="couleur">Couleur</Label>
                                <Input
                                    id="couleur"
                                    placeholder="Ex: Noir, Blanc, Rouge"
                                    value={form.couleur}
                                    onChange={(e) => setForm({ ...form, couleur: e.target.value })}
                                    className={errors.couleur ? "border-red-500" : ""}
                                />
                                {errors.couleur && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.couleur}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="quantite">Quantité</Label>
                                <Input
                                    id="quantite"
                                    type="number"
                                    placeholder="Ex: 10"
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
                        </div>

                        {errors.general && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.general}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex gap-2 pt-4">
                            <Button type="submit" className="flex items-center gap-2">
                                {editProdId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                {editProdId ? "Modifier" : "Ajouter"}
                            </Button>
                            {editProdId && (
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

            {/* Products List */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventaire des Produits</CardTitle>
                    <CardDescription>
                        {products.length} produit{products.length > 1 ? "s" : ""} en inventaire
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Aucun produit trouvé</p>
                            <p className="text-sm">Commencez par ajouter votre premier produit</p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Genre</TableHead>
                                        <TableHead>Pointure</TableHead>
                                        <TableHead>Couleur</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => {
                                        const stockStatus = getStockStatus(product.quantite)
                                        return (
                                            <TableRow key={product._id}>
                                                <TableCell className="font-medium">{product.reference}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getTypeBadgeVariant(product.type)}>{product.type}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getGenreBadgeVariant(product.genre)}>{product.genre}</Badge>
                                                </TableCell>
                                                <TableCell>{product.pointure}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded-full border border-gray-300"
                                                            style={{
                                                                backgroundColor: product.couleur.toLowerCase().includes("noir")
                                                                    ? "#000000"
                                                                    : product.couleur.toLowerCase().includes("blanc")
                                                                        ? "#ffffff"
                                                                        : product.couleur.toLowerCase().includes("rouge")
                                                                            ? "#ef4444"
                                                                            : product.couleur.toLowerCase().includes("bleu")
                                                                                ? "#3b82f6"
                                                                                : product.couleur.toLowerCase().includes("vert")
                                                                                    ? "#22c55e"
                                                                                    : product.couleur.toLowerCase().includes("jaune")
                                                                                        ? "#eab308"
                                                                                        : "#6b7280",
                                                            }}
                                                        />
                                                        {product.couleur}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{product.quantite}</TableCell>
                                                <TableCell>
                                                    <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => editProduct(product)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => deleteProduct(product._id)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
        // <div className="p-4">
        //     <h1>👟 Produits</h1>
        //     <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
        //         <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
        //         {errors.reference && <p className="text-red-500">{errors.reference}</p>}

        //         <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} >
        //             <option value={''}>Type</option>
        //             <option value={'CHAUSSURE'}>CHAUSSURE</option>
        //             <option value={'BASKETS'}>BASKETS</option>
        //             <option value={'ESPADRILLES'}>ESPADRILLES</option>
        //             <option value={'SANDALES'}>SANDALES</option>
        //             <option value={'CLAQUETTES'}>CLAQUETTES</option>
        //         </select>
        //         {errors.type && <p className="text-red-500">{errors.type}</p>}

        //         <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} >
        //             <option value={''}>Genre</option>
        //             <option value={'HOMME'}>HOMME</option>
        //             <option value={'FEMME'}>FEMME</option>
        //             <option value={'GARÇON'}>GARÇON</option>
        //             <option value={'FILLE'}>FILLE</option>
        //         </select>
        //         {errors.genre && <p className="text-red-500">{errors.genre}</p>}

        //         <input placeholder="Pointure" value={form.pointure} onChange={e => setForm({ ...form, pointure: e.target.value })} />
        //         {errors.pointure && <p className="text-red-500">{errors.pointure}</p>}

        //         <input placeholder="Couleur" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })} />
        //         {errors.couleur && <p className="text-red-500">{errors.couleur}</p>}

        //         <input placeholder="Quantite" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} />
        //         {errors.quantite && <p className="text-red-500">{errors.quantite}</p>}

        //         <button type="submit">{editProdId ? '💾 Modifier' : '➕ Ajouter'} </button>
        //         {editProdId && <button onClick={cancelEdit}>➕ Annuler</button>}

        //         {errors.general && <p className="text-red-500">{errors.general}</p>}
        //     </form>
        //     {products.map(p => (
        //         <div key={p._id}>
        //             <p >reference: {p.reference}, type: {p.type}, genre: {p.genre}, pointure: {p.pointure}, couleur: {p.couleur}, quantite: {p.quantite}</p>
        //             <button onClick={() => editProduct(p)}>💾 Modifier</button>
        //             <button onClick={() => deleteProduct(p._id)}>🗑️ Supprimer</button>
        //         </div>
        //     ))}
        // </div>
    )
}