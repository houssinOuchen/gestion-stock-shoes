import Link from "next/link";
import Sign_Out from "./Sign_Out";


export default function SideBar() {

    return (
        <div>
            <h1 className="text-2xl font-bold">🛠️ Stock Management Test Pages</h1>
            <Link href="/users">👤 Gérer les utilisateurs</Link>
            <Link href="/produits">👟 Gérer les produits</Link>
            <Link href="/matieres_Premieres">🧪 Gérer les matières premières</Link>
            <Sign_Out />
        </div>

    )
}