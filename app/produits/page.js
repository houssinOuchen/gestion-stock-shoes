'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


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

    return (
        <div className="p-4">
            <h1>👟 Produits</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
                <input placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                {errors.reference && <p className="text-red-500">{errors.reference}</p>}

                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} >
                    <option value={''}>Type</option>
                    <option value={'CHAUSSURE'}>CHAUSSURE</option>
                    <option value={'BASKETS'}>BASKETS</option>
                    <option value={'ESPADRILLES'}>ESPADRILLES</option>
                    <option value={'SANDALES'}>SANDALES</option>
                    <option value={'CLAQUETTES'}>CLAQUETTES</option>
                </select>
                {errors.type && <p className="text-red-500">{errors.type}</p>}

                <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} >
                    <option value={''}>Genre</option>
                    <option value={'HOMME'}>HOMME</option>
                    <option value={'FEMME'}>FEMME</option>
                    <option value={'GARÇON'}>GARÇON</option>
                    <option value={'FILLE'}>FILLE</option>
                </select>
                {errors.genre && <p className="text-red-500">{errors.genre}</p>}

                <input placeholder="Pointure" value={form.pointure} onChange={e => setForm({ ...form, pointure: e.target.value })} />
                {errors.pointure && <p className="text-red-500">{errors.pointure}</p>}

                <input placeholder="Couleur" value={form.couleur} onChange={e => setForm({ ...form, couleur: e.target.value })} />
                {errors.couleur && <p className="text-red-500">{errors.couleur}</p>}

                <input placeholder="Quantite" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} />
                {errors.quantite && <p className="text-red-500">{errors.quantite}</p>}

                <button type="submit">{editProdId ? '💾 Modifier' : '➕ Ajouter'} </button>
                {editProdId && <button onClick={cancelEdit}>➕ Annuler</button>}

                {errors.general && <p className="text-red-500">{errors.general}</p>}
            </form>
            {products.map(p => (
                <div key={p._id}>
                    <p >reference: {p.reference}, type: {p.type}, genre: {p.genre}, pointure: {p.pointure}, couleur: {p.couleur}, quantite: {p.quantite}</p>
                    <button onClick={() => editProduct(p)}>💾 Modifier</button>
                    <button onClick={() => deleteProduct(p._id)}>🗑️ Supprimer</button>
                </div>
            ))}
        </div>
    )
}