"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation";


export default function Sign_Out() {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await fetch("/api/logout");
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  )
}