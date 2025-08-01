'use client'
import Link from 'next/link'
import Sign_Out from './Sign_Out'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SideBar from './SideBar'

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
            <SideBar />
        </div>
    )
}
