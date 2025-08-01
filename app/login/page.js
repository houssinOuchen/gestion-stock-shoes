'use client'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function LoginPage() {
    const { data: session, status } = useSession()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (status == 'authenticated') {
            router.push('/')
            return;
        }
    }, [status])

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        if (res.error) {
            setError(res.error)
        } else {
            router.push('/');
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl mb-4 font-bold">Connexion</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
                <input type={showPwd ? 'text' : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}>{showPwd ? 'hide' : 'show'}</button>
                <button type="submit">Se connecter</button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    )
}