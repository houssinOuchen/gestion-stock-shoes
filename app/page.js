'use client'

import Link from 'next/link'
import Sign_Out from './Sign_Out'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from "@/lib/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Package, Factory, Settings, BarChart3, TrendingUp, AlertCircle } from "lucide-react"


export default function HomePage() {
    const user = useAuth();;
    const router = useRouter()

    // useEffect(() => {
    //     if (status == 'unauthenticated') {
    //         router.push('/login')
    //         return;
    //     }
    // }, [status])
    if (!user) return null;

    const navigationCards = [
        {
            title: "Gestion des Utilisateurs",
            description: "Gérez les comptes utilisateurs et leurs permissions d'accès",
            icon: Users,
            href: "/users",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            stats: "Gérer les accès",
        },
        {
            title: "Gestion des Produits",
            description: "Gérez votre inventaire de chaussures et accessoires",
            icon: Package,
            href: "/produits",
            color: "text-green-600",
            bgColor: "bg-green-50",
            stats: "Inventaire complet",
        },
        {
            title: "Matières Premières",
            description: "Gérez votre stock de matières premières et fournisseurs",
            icon: Factory,
            href: "/matieres_Premieres",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            stats: "Stock & Fournisseurs",
        },
    ]

    const quickStats = [
        {
            title: "Utilisateurs Actifs",
            value: "12",
            change: "+2 ce mois",
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Produits en Stock",
            value: "1,234",
            change: "+15% ce mois",
            icon: Package,
            color: "text-green-600",
        },
        {
            title: "Matières Premières",
            value: "89",
            change: "3 en rupture",
            icon: AlertCircle,
            color: "text-orange-600",
        },
        {
            title: "Ventes du Mois",
            value: "€24,500",
            change: "+8% vs mois dernier",
            icon: TrendingUp,
            color: "text-purple-600",
        },
    ]

    // if (status === "loading") {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    //         </div>
    //     )
    // }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Settings className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Système de Gestion</h1>
                                {/* <p className="text-sm text-gray-600">Bienvenue, {session?.user?.email || "Utilisateur"}</p> */}
                            </div>
                        </div>
                        <Sign_Out />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h2>
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {navigationCards.map((card, index) => {
                        const isUserCard = card.title === "Gestion des Utilisateurs";
                        const isAdmin = user.role === "ADMIN";

                        if (isAdmin || !isUserCard) {
                            return (
                                <Link key={index} href={card.href} className="group">
                                    <Card className="h-full hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-0 shadow-md">
                                        <CardHeader className="pb-4">
                                            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                                <card.icon className={`h-6 w-6 ${card.color}`} />
                                            </div>
                                            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {card.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 leading-relaxed">{card.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                                >
                                                    Accéder →
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        }

                        return null; // Don't render anything if not allowed
                    })}
                </div>
            </div>
        </div>
        // <div className="p-6 flex flex-col gap-3">
        //     <h1 className="text-2xl font-bold">🛠️ Stock Management Test Pages</h1>
        //     <Link href="/users">👤 Gérer les utilisateurs</Link>
        //     <Link href="/produits">👟 Gérer les produits</Link>
        //     <Link href="/matieres_Premieres">🧪 Gérer les matières premières</Link>
        //     <Sign_Out />
        // </div>
    )
}
