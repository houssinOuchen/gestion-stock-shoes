'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Factory, Plus, Save, X, Edit, Trash2, AlertCircle, Package2, Building2 } from "lucide-react"
import MatiereSortiePage from "../matiere_Sorties/MatiereSortiePage";
import MatiereEntreePage from "../matieres_Entrees/MatiereEntreePage";


export default function Matiere_Premiere() {
  // const { data: session, status } = useSession()
  const [matiere, setMatiere] = useState([]);
  const [form, setForm] = useState({ nom: '', reference: '', unite: '', quantite: '', fournisseur: '' });
  const [errors, setErrors] = useState({});
  const [editMatId, setEditMatId] = useState(null)
  const router = useRouter()

  // useEffect(() => {
  //   if (status == 'unauthenticated') {
  //     router.push('/login')
  //   }
  // }, [status])

  useEffect(() => {
    fetch('/api/matieres_Premieres')
      .then(res => res.json())
      .then(data => setMatiere(data.matieres))
  }, [])

  const ValidateForm = () => {
    const newErrors = {};

    if (!form.nom) newErrors.nom = 'Le Nom de la matiere est requis!';
    if (!form.reference) newErrors.reference = 'La Reference de la matiere est requis!';
    if (!form.unite) newErrors.unite = "L'Unite de la matiere est requis!";
    if (!form.quantite) newErrors.quantite = 'La Quantite de la matiere est requis!';
    if (!form.fournisseur) newErrors.fournisseur = 'Le Fournisseur de la matiere est requis!';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const refreshMatiere = async () => {
    const res = await fetch('/api/matieres_Premieres')
    const data = await res.json()
    setMatiere(data.matieres)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ValidateForm()) return;
    try {
      const res = await fetch(editMatId ? `/api/matieres_Premieres/${editMatId}` : '/api/matieres_Premieres', {
        method: editMatId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setErrors({ general: data.error || 'Something went wrong!' });
        return;
      }

      setForm({ nom: '', reference: '', unite: '', quantite: '', fournisseur: '' })
      setEditMatId(null)
      setErrors({})
      refreshMatiere();
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrors({ general: 'Failed to submit form. Please try again.' });
    }
  }

  const editMatiere = (mat) => {
    setForm({
      nom: mat.nom,
      reference: mat.reference,
      unite: mat.unite,
      quantite: mat.quantite,
      fournisseur: mat.fournisseur
    })

    setEditMatId(mat._id)
    setErrors({})
  }

  const cancelEdit = () => {
    setForm({
      nom: '',
      reference: '',
      unite: '',
      quantite: '',
      fournisseur: ''
    })

    setEditMatId(null)
    setErrors({})
  }
  const deleteMatiere = async (id) => {
    try {
      await fetch(`/api/matieres_Premieres/${id}`, {
        method: 'DELETE',
      })
    } catch (err) {
      console.error('error in deleteMatiere: ', err)
    } finally {
      refreshMatiere()
    }
  }

  const getStockStatus = (quantite) => {
    const qty = Number.parseInt(quantite)
    if (qty === 0) return { variant: "destructive", text: "Rupture" }
    if (qty < 10) return { variant: "secondary", text: "Stock faible" }
    if (qty < 50) return { variant: "outline", text: "Stock moyen" }
    return { variant: "default", text: "Stock suffisant" }
  }

  const getUniteBadgeVariant = (unite) => {
    switch (unite.toLowerCase()) {
      case "kg":
      case "kilogramme":
        return "default"
      case "l":
      case "litre":
        return "secondary"
      case "m":
      case "mètre":
        return "outline"
      case "pièce":
      case "unité":
        return "destructive"
      default:
        return "default"
    }
  }

  const getTotalValue = () => {
    return matiere.reduce((total, mat) => total + Number.parseInt(mat.quantite || 0), 0)
  }

  const getLowStockCount = () => {
    return matiere.filter((mat) => Number.parseInt(mat.quantite || 0) < 10).length
  }


  return (
    <div className="mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Factory className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Matières Premières</h1>
          <p className="text-muted-foreground">Gérez votre stock de matières premières et fournisseurs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 my-3 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Matières</p>
              <p className="text-2xl font-bold">{matiere.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <AlertCircle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Stock Faible</p>
              <p className="text-2xl font-bold">{getLowStockCount()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Building2 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Fournisseurs</p>
              <p className="text-2xl font-bold">{new Set(matiere.map((m) => m.fournisseur)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Material Form */}
      <div className="my-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editMatId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editMatId ? "Modifier la matière première" : "Ajouter une matière première"}
            </CardTitle>
            <CardDescription>
              {editMatId
                ? "Modifiez les informations de la matière première"
                : "Ajoutez une nouvelle matière première à votre stock"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom de la matière</Label>
                  <Input
                    id="nom"
                    placeholder="Ex: Cuir synthétique"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className={errors.nom ? "border-red-500" : ""}
                  />
                  {errors.nom && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.nom}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    placeholder="Ex: MAT-001"
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
                  <Label htmlFor="unite">Unité de mesure</Label>
                  <Input
                    id="unite"
                    placeholder="Ex: kg, L, m, pièce"
                    value={form.unite}
                    onChange={(e) => setForm({ ...form, unite: e.target.value })}
                    className={errors.unite ? "border-red-500" : ""}
                  />
                  {errors.unite && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.unite}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantite">Quantité</Label>
                  <Input
                    id="quantite"
                    type="number"
                    placeholder="Ex: 100"
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
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fournisseur">Fournisseur</Label>
                  <Input
                    id="fournisseur"
                    placeholder="Ex: Société ABC"
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
                  {editMatId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {editMatId ? "Modifier" : "Ajouter"}
                </Button>
                {editMatId && (
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

      {/* Materials List */}
      <div className="my-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventaire des Matières Premières</CardTitle>
            <CardDescription>
              {matiere.length} matière{matiere.length > 1 ? "s" : ""} première{matiere.length > 1 ? "s" : ""} en stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matiere.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune matière première trouvée</p>
                <p className="text-sm">Commencez par ajouter votre première matière première</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Unité</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matiere.map((material) => {
                      const stockStatus = getStockStatus(material.quantite)
                      return (
                        <TableRow key={material._id}>
                          <TableCell className="font-medium">{material.nom}</TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">{material.reference}</code>
                          </TableCell>
                          <TableCell className="font-medium">{material.quantite}</TableCell>
                          <TableCell>
                            <Badge variant={getUniteBadgeVariant(material.unite)}>{material.unite}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {material.fournisseur}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editMatiere(material)}
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Modifier
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMatiere(material._id)}
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
      <MatiereEntreePage refreshMatiere={refreshMatiere} />
      <MatiereSortiePage refreshMatiere={refreshMatiere} />
    </div>
  )
}



// <div className="p-4">
//     <h1>👤 Matières Premières</h1>
//     <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
//         <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
//         {errors.nom && <p className="text-red-500">{errors.nom}</p>}

//         <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
//         {errors.reference && <p className="text-red-500">{errors.reference}</p>}

//         <input placeholder="Unite" value={form.unite} onChange={e => setForm({ ...form, unite: e.target.value })} />
//         {errors.unite && <p className="text-red-500">{errors.unite}</p>}

//         <input placeholder="Quantite" type="Number" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} />
//         {errors.quantite && <p className="text-red-500">{errors.quantite}</p>}

//         <input placeholder="Fournisseur" value={form.fournisseur} onChange={e => setForm({ ...form, fournisseur: e.target.value })} />
//         {errors.fournisseur && <p className="text-red-500">{errors.fournisseur}</p>}

//         <button type="submit">{editMatId ? '💾 Modifier' : '➕ Ajouter'}</button>
//         {editMatId && <button onClick={cancelEdit} >❌ Annuler</button>}

//         {errors.general && <p className="text-red-500">{errors.general}</p>}
//     </form>

//     {matiere?.map(m => (
//         <div key={m._id}>
//             <p >La matières: {m.nom}, reference: {m.reference}, unite: {m.unite}, quantite: {m.quantite} (fournisseur: {m.fournisseur})</p>
//             <button onClick={() => editMatiere(m)}>💾 Modifier</button>
//             <button onClick={() => deleteMatiere(m._id)}>🗑️ Supprimer</button>
//         </div>
//     ))}
// </div>