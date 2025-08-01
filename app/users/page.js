'use client'
import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'


export default function UsersPage() {
    const { data: session, status } = useSession()
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({ username: '', email: '', password: '', acces: '' })
    const [errors, setErrors] = useState({})
    const [editUserId, setEditUserId] = useState(null);
    const [showPwd, setShowPwd] = useState(false);
    const router = useRouter()


    useEffect(() => {
        if (status == 'unauthenticated') {
            router.push('/login');
        }
    }, [status])

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))

    }, [])

    const refreshUsers = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data.users);
    }

    const validateForm = () => {
        const newErrors = {};

        if (!form.username) newErrors.username = 'The username is required!';
        if (!form.email) newErrors.email = 'The email is required!';
        else if (!isValidEmail(form.email)) newErrors.email = 'Email format is not valid!';
        if (!editUserId) if (!form.password) newErrors.password = 'The password is required!';
        else if (editUserId) newErrors.password = '';
        else if (!isValidPassword(form.password)) newErrors.password = 'Password format is not valid! should contains uppercase, lowercase, digit, special charechter and at least 8 charechters';
        if (!form.acces) newErrors.acces = 'The acces is required!';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        try {
            const res = await fetch(editUserId ? `/api/users/${editUserId}` : '/api/users', {
                method: editUserId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) {
                setErrors({ general: data.error || 'Something went wrong!' });
                return;
            }

            setForm({ username: '', email: '', password: '', acces: '' });
            setEditUserId(null)
            setErrors({});
            refreshUsers();
        } catch (err) {
            console.error('Error submitting form:', err);
            setErrors({ general: 'Failed to submit form. Please try again.' });
        }
    }

    async function deleteUser(id) {
        try {
            await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            })
        } catch (err) {
            console.log('error in deleteUser() method:', err)
        } finally {
            refreshUsers();
        }

    }

    const startEditUser = (user) => {
        setForm({
            username: user.username,
            email: user.email,
            password: '',
            acces: user.acces,
        })
        setEditUserId(user._id)
        setErrors({})
    }

    const cancelEdit = () => {
        setForm({
            username: '',
            email: '',
            password: '',
            acces: '',
        })
        setEditUserId(null)
        setErrors({})
    }


    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return pwdRegex.test(password);
    }


    return (
        <div className="p-4">
            <h1>👤 Utilisateurs</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
                <input placeholder="Nom" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                {errors.username && <p className="text-red-500">{errors.username}</p>}

                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete='username' />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

                <input placeholder="Mot de passe" type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
                <button type='button' onClick={() => setShowPwd(!showPwd)} >{showPwd ? 'hide' : 'show'}</button>
                {errors.password && <p className="text-red-500">{errors.password}</p>}

                <select value={form.acces} onChange={e => setForm({ ...form, acces: e.target.value })} >
                    <option value={''}>Acces</option>
                    <option value={'OPERATOR'}>OPERATOR</option>
                    <option value={'ADMIN'}>ADMIN</option>
                    <option value={'STOCK_MANAGER'}>STOCK_MANAGER</option>
                    <option value={'COMMERCIALE'}>COMMERCIALE</option>
                </select>
                {errors.acces && <p className="text-red-500">{errors.acces}</p>}

                <button type="submit">{editUserId ? '💾 Modifier' : '➕ Ajouter'} </button>
                {editUserId && <button onClick={cancelEdit} >❌ Annuler</button>}

                {errors.general && <p className="text-red-500">{errors.general}</p>}
            </form>

            {users?.map(u => (
                <div key={u._id}>
                    <p >username: {u.username}, email: {u.email}, password: {u.password} ({u.acces})</p>
                    <button onClick={() => deleteUser(u._id)}>🗑️ Supprimer</button>
                    <button onClick={() => startEditUser(u)}>💾 Modifier</button>
                </div>
            ))}
        </div>
    )
}
