'use client';
import { useEffect, useState } from 'react';

export default function ProductionSection({refreshProducts}) {
    const [productions, setProductions] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ produit_id: '', quantite: '', date: '' });
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchProductions();
        fetchProducts();
    }, []);

    const fetchProductions = async () => {
        const res = await fetch('/api/productions');
        const data = await res.json();
        setProductions(data.productions || []);
    };

    const fetchProducts = async () => {
        const res = await fetch('/api/produits');
        const data = await res.json();
        setProducts(data.prods || []);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.produit_id) newErrors.produit_id = 'Produit requis';
        if (!form.quantite) newErrors.quantite = 'Quantité requise';
        if (!form.date) newErrors.date = 'Date requise';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch(editId ? `/api/productions/${editId}` : '/api/productions', {
                method: editId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            refreshProducts();
            
            if (!res.ok) {
                const data = await res.json();
                setErrors({ general: data.error || 'Erreur inconnue' });
                return;
            }

            setForm({ produit_id: '', quantite: '', date: '' });
            fetchProductions();
        } catch (err) {
            setErrors({ general: 'Erreur réseau' });
        }
    };

    const cancelEdit = () => {
         setForm({ produit_id: '', quantite: '', date: '' });
        setEditId(null);
        setErrors({});
    }

    const handleEdit = (prod) => {
        setForm({ produit_id: prod.produit_id._id, quantite: prod.quantite, date: prod.date?.slice(0, 10) });
        setEditId(prod._id);
        setErrors({});
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/productions/${id}`, { method: 'DELETE' });
            fetchProductions();
            refreshProducts();
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    return (
        <div className="mt-10 p-4 bg-white shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Gestion de Production</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Produit</label>
                    <select value={form.produit_id} onChange={(e) => setForm({ ...form, produit_id: e.target.value })} className="w-full p-2 border rounded" >
                        <option value="">-- Choisir un produit --</option>
                        {products.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                                {prod.reference} ({prod.genre}, {prod.couleur})
                            </option>
                        ))}
                    </select>
                    {errors.produit_id && <p className="text-red-600">{errors.produit_id}</p>}
                </div>

                <div>
                    <label>Quantité</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={form.quantite}
                        onChange={(e) => setForm({ ...form, quantite: e.target.value })}
                    />
                    {errors.quantite && <p className="text-red-600">{errors.quantite}</p>}
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    {errors.date && <p className="text-red-600">{errors.date}</p>}
                </div>

                <div className="flex space-x-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        {editId ? 'Modifier' : 'Ajouter'}
                    </button>
                    {editId && (
                        <button type="button" onClick={cancelEdit} className="bg-gray-400 px-4 py-2 rounded">
                            Annuler
                        </button>
                    )}
                </div>

                {errors.general && <p className="text-red-600">{errors.general}</p>}
            </form>

            <h3 className="mt-8 mb-2 font-semibold">Liste des Productions</h3>
            <table className="w-full border mt-2">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Produit</th>
                        <th className="border px-2 py-1">Quantité</th>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {productions.map((p) => (
                        <tr key={p._id}>
                            <td className="border px-2 py-1">{p.produit_id?.reference}</td>
                            <td className="border px-2 py-1">{p.quantite}</td>
                            <td className="border px-2 py-1">{p.date?.slice(0, 10)}</td>
                            <td className="border px-2 py-1 space-x-2">
                                <button onClick={() => handleEdit(p)} className="text-blue-600">Edit</button>
                                <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
