'use client'
import Link from 'next/link'
import Sign_Out from './Sign_Out'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function HomePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status == 'unauthenticated') {
            router.push('/login')
            return;
        }
    }, [status])

    return (
        <div className="p-6 flex flex-col gap-3">
            <h1 className="text-2xl font-bold">🛠️ Stock Management Test Pages</h1>
            <Link href="/users">👤 Gérer les utilisateurs</Link>
            <Link href="/produits">👟 Gérer les produits</Link>
            <Link href="/matieres_Premieres">🧪 Gérer les matières premières</Link>
            <Sign_Out />
        </div>
    )
}
