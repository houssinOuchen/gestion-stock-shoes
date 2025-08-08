'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="text-center text-red-600 mt-10">
      <h1 className="text-2xl font-bold mb-4">403 - Accès Refusé</h1>
      <p className="mb-6">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      <button
        onClick={() => router.back()}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Retour à la page précédente
      </button>
    </div>
  );
}
