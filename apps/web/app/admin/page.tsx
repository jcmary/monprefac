'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const token = getToken();
    if (!token) { router.push('/connexion'); return; }
    try {
      const res = await fetch(`${API_URL}/courses/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Accès refusé');
      setCourses(await res.json());
    } catch { router.push('/'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, [router]);

  const changeStatus = async (id: string, status: string) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/courses/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchCourses();
    } catch (err) { alert('Erreur'); }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <h1 className="mb-10 font-serif text-3xl text-white md:text-5xl">Panneau d&apos;Administration</h1>

        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-5 font-semibold">Cours</th>
                  <th className="px-6 py-5 font-semibold">Professeur</th>
                  <th className="px-6 py-5 font-semibold">Prix</th>
                  <th className="px-6 py-5 font-semibold">Statut</th>
                  <th className="px-6 py-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {courses.map((course) => (
                  <tr key={course.id} className="transition hover:bg-white/5">
                    <td className="px-6 py-5">
                      <p className="font-bold text-white text-base">{course.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{course.subject}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-300">{course.teacher.fullName}</td>
                    <td className="px-6 py-5 text-slate-300">{course.price} HTG</td>
                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                        course.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                        'bg-orange-500/10 text-orange-400'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {course.status !== 'PUBLISHED' && (
                          <button onClick={() => changeStatus(course.id, 'PUBLISHED')} className="rounded bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/30">
                            Publier
                          </button>
                        )}
                        {course.status !== 'REJECTED' && (
                          <button onClick={() => changeStatus(course.id, 'REJECTED')} className="rounded bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/30">
                            Rejeter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {courses.length === 0 && (
            <div className="p-12 text-center text-slate-400">Aucun cours dans la base de données.</div>
          )}
        </div>
      </div>
    </main>
  );
}