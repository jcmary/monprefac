'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/connexion'); return; }

    fetch(`${API_URL}/courses/my-enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { 
        if (res.status === 401) { router.push('/connexion'); throw new Error('401'); }
        if (!res.ok) throw new Error('Erreur serveur');
        return res.json(); 
      })
      .then((data) => { setEnrollments(data); setLoading(false); })
      .catch((err) => { if (err.message !== '401') { setError(true); setLoading(false); } });
  }, [router]);

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <h1 className="font-serif text-3xl text-white mb-10 md:text-5xl">Mon Espace <span className="gradient-text">Élève</span></h1>

        <h2 className="font-serif text-2xl text-white mb-6">Mes cours</h2>
        
        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 font-semibold mb-2">Impossible de charger tes cours.</p>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-full bg-red-500/20 px-6 py-2 text-sm text-red-300 font-semibold hover:bg-red-500/30 transition">Réessayer</button>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-6">Tu n'es inscrit à aucun cours pour le moment.</p>
            <Link href="/cours" className="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition">Découvrir le catalogue</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="glass-card flex flex-col rounded-2xl p-6">
                <div className="mb-4 flex gap-2">
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{enrollment.course.subject}</span>
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-white">{enrollment.course.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 flex-1 mb-6">{enrollment.course.description}</p>
                
                <Link href={`/eleve/cours/${enrollment.course.id}`} className="mt-auto block w-full text-center rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500">
                  Continuer le cours
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}