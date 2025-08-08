'use client'

import { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Save, X, Edit, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react"
import useAuth from '@/lib/useAuth'

export default function UsersPage() {
    const user = useAuth(["ADMIN"]);
    const [users, setUsers] = useState([])
    const [form, setForm] = useState({ username: '', email: '', password: '', acces: '' })
    const [errors, setErrors] = useState({})
    const [editUserId, setEditUserId] = useState(null);
    const [showPwd, setShowPwd] = useState(false);
    const router = useRouter()


    // useEffect(() => {
    //     if (status == 'unauthenticated') {
    //         router.push('/login');
    //     }
    // }, [status])

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.users))

    }, [])

    if (!user) return null;

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

    const getAccessBadgeVariant = (access) => {
        switch (access) {
            case "ADMIN":
                return "destructive"
            case "OPERATOR":
                return "default"
            case "STOCK_MANAGER":
                return "secondary"
            case "COMMERCIALE":
                return "outline"
            default:
                return "default"
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">Gérez les utilisateurs et leurs permissions</p>
                </div>
            </div>

            {/* Add/Edit User Form */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {editUserId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            {editUserId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                        </CardTitle>
                        <CardDescription>
                            {editUserId ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte utilisateur"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nom d'utilisateur</Label>
                                    <Input
                                        id="username"
                                        placeholder="Entrez le nom d'utilisateur"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className={errors.username ? "border-red-500" : ""}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="exemple@email.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        autoComplete="username"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPwd ? "text" : "password"}
                                            placeholder="Entrez le mot de passe"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            autoComplete="new-password"
                                            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPwd(!showPwd)}
                                        >
                                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="access">Niveau d'accès</Label>
                                    <Select value={form.acces} onValueChange={(value) => setForm({ ...form, acces: value })}>
                                        <SelectTrigger className={errors.acces ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Sélectionnez un niveau d'accès" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPERATOR">Opérateur</SelectItem>
                                            <SelectItem value="ADMIN">Administrateur</SelectItem>
                                            <SelectItem value="STOCK_MANAGER">Gestionnaire de Stock</SelectItem>
                                            <SelectItem value="COMMERCIALE">Commercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.acces && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.acces}
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
                                    {editUserId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    {editUserId ? "Modifier" : "Ajouter"}
                                </Button>
                                {editUserId && (
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
            {/* Users List */}
            <div className="my-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Utilisateurs</CardTitle>
                        <CardDescription>
                            {users.length} utilisateur{users.length > 1 ? "s" : ""} enregistré{users.length > 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Aucun utilisateur trouvé</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom d'utilisateur</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Niveau d'accès</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell className="font-medium">{user.username}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getAccessBadgeVariant(user.acces)}>{user.acces}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditUser(user)}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                            Modifier
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => deleteUser(user._id)}
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
        // <div className="p-4">
        //     <h1>👤 Utilisateurs</h1>
        //     <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-4">
        //         <input placeholder="Nom" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        //         {errors.username && <p className="text-red-500">{errors.username}</p>}

        //         <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete='username' />
        //         {errors.email && <p className="text-red-500">{errors.email}</p>}

        //         <input placeholder="Mot de passe" type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
        //         <button type='button' onClick={() => setShowPwd(!showPwd)} >{showPwd ? 'hide' : 'show'}</button>
        //         {errors.password && <p className="text-red-500">{errors.password}</p>}

        //         <select value={form.acces} onChange={e => setForm({ ...form, acces: e.target.value })} >
        //             <option value={''}>Acces</option>
        //             <option value={'OPERATOR'}>OPERATOR</option>
        //             <option value={'ADMIN'}>ADMIN</option>
        //             <option value={'STOCK_MANAGER'}>STOCK_MANAGER</option>
        //             <option value={'COMMERCIALE'}>COMMERCIALE</option>
        //         </select>
        //         {errors.acces && <p className="text-red-500">{errors.acces}</p>}

        //         <button type="submit">{editUserId ? '💾 Modifier' : '➕ Ajouter'} </button>
        //         {editUserId && <button onClick={cancelEdit} >❌ Annuler</button>}

        //         {errors.general && <p className="text-red-500">{errors.general}</p>}
        //     </form>

        //     {users?.map(u => (
        //         <div key={u._id}>
        //             <p >username: {u.username}, email: {u.email}, password: {u.password} ({u.acces})</p>
        //             <button onClick={() => deleteUser(u._id)}>🗑️ Supprimer</button>
        //             <button onClick={() => startEditUser(u)}>💾 Modifier</button>
        //         </div>
        //     ))}
        // </div>
    )
}
