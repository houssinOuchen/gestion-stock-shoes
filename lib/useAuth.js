"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";


export default function useAuth(allowedRoles = []) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        router.push("/unauthorized");
      }
    } catch (err) {
      localStorage.removeItem("token");
      console.error("Token invalide ou expiré", err);
      router.push("/login");
    }
  }, []);

  return user;
}
