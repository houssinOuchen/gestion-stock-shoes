'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Matiere_Premiere() {
    const { data: session, status } = useSession()
    const [matiere, setMatiere] = useState([]);
    const [form, setForm] = useState({ nom: '', reference: '', unite: '', quantite: '', fournisseur: '' });
    const [errors, setErrors] = useState({});
    const [editMatId, setEditMatId] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (status == 'unauthenticated') {
            router.push('/login')
        }
    }, [status])

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

    return (
        <div className="p-4">
            <h1>👤 Matières Premières</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
                <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
                {errors.nom && <p className="text-red-500">{errors.nom}</p>}

                <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                {errors.reference && <p className="text-red-500">{errors.reference}</p>}

                <input placeholder="Unite" value={form.unite} onChange={e => setForm({ ...form, unite: e.target.value })} />
                {errors.unite && <p className="text-red-500">{errors.unite}</p>}

                <input placeholder="Quantite" type="Number" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} />
                {errors.quantite && <p className="text-red-500">{errors.quantite}</p>}

                <input placeholder="Fournisseur" value={form.fournisseur} onChange={e => setForm({ ...form, fournisseur: e.target.value })} />
                {errors.fournisseur && <p className="text-red-500">{errors.fournisseur}</p>}

                <button type="submit">{editMatId ? '💾 Modifier' : '➕ Ajouter'}</button>
                {editMatId && <button onClick={cancelEdit} >❌ Annuler</button>}

                {errors.general && <p className="text-red-500">{errors.general}</p>}
            </form>

            {matiere?.map(m => (
                <div key={m._id}>
                    <p >La matières: {m.nom}, reference: {m.reference}, unite: {m.unite}, quantite: {m.quantite} (fournisseur: {m.fournisseur})</p>
                    <button onClick={() => editMatiere(m)}>💾 Modifier</button>
                    <button onClick={() => deleteMatiere(m._id)}>🗑️ Supprimer</button>
                </div>
            ))}
        </div>
    )
}