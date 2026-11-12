'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function TeacherProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/users/teacher/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => { setTeacher(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;
  if (error || !teacher) return <div className="p-12 text-center text-red-400">Professeur introuvable</div>;

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        
        <button onClick={() => router.back()} className="mb-8 text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">
          ← Retour
        </button>

        {/* En-tête du Prof */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-4xl md:text-6xl shadow-lg">
            👨‍🏫
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-4">{teacher.fullName || 'Professeur'}</h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {teacher.bio || "Ce professeur n'a pas encore ajouté de biographie."}
            </p>
          </div>
        </div>

        {/* Les cours du prof */}
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-6">Cours proposés par {teacher.fullName ? teacher.fullName.split(' ')[0] : 'ce prof'} ({teacher.courses.length})</h2>
        
        {teacher.courses.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-slate-400">Ce professeur n'a pas encore publié de cours.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teacher.courses.map((course: any) => (
              <Link key={course.id} href={`/cours/${course.id}`} className="glass-card group flex flex-col rounded-2xl overflow-hidden">
                {course.coverImage ? (
                  <img src={course.coverImage} alt={course.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center text-4xl">📚</div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3 flex gap-2">
                    <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{course.subject}</span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-white group-hover:text-brand-400 transition">{course.title}</h3>
                  <p className="mb-4 text-sm text-slate-400 line-clamp-2 flex-1">{course.description}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <p className="font-bold text-brand-400">{course.price > 0 ? `${course.price} HTG` : 'Gratuit'}</p>
                    <span className="text-xs font-bold text-brand-500">Voir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}