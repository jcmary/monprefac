'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import Link from 'next/link';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CataloguePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const fetchCourses = fetch(`${API_URL}/courses`).then((res) => res.json()).catch(() => []);
    const fetchUser = token ? fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.ok ? res.json() : null).catch(() => null) : Promise.resolve(null);

    Promise.all([fetchCourses, fetchUser]).then(([coursesData, userData]) => {
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setUser(userData);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-3xl text-white md:text-5xl">Explore le <span className="gradient-text">Catalogue</span></h1>
        </div>

        {loading ? <p className="text-center text-slate-500">Chargement...</p> : courses.length === 0 ? <div className="glass rounded-2xl p-12 text-center"><p className="text-slate-400">Aucun cours disponible.</p></div> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="glass-card flex flex-col rounded-2xl overflow-hidden">
                {course.coverImage ? (
                  <img src={course.coverImage} alt={course.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-slate-800/50 flex items-center justify-center text-4xl">📚</div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{course.subject}</span>
                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">{course.exam}</span>
                  </div>
                  <h2 className="mb-2 font-serif text-xl font-bold text-white">{course.title}</h2>
                  <p className="mb-4 text-sm text-slate-400 line-clamp-2 flex-1">{course.description}</p>
                  
                  {/* ETOILES */}
                  {course.reviewCount > 0 && (
                    <div className="flex items-center gap-1 text-sm text-amber-400 font-bold mb-3">
                      <span>⭐ {course.averageRating}</span>
                      <span className="text-xs text-slate-500 font-normal">({course.reviewCount})</span>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Par{' '}
                        <Link href={`/prof/${course.teacher.id}`} className="font-semibold text-slate-300 hover:text-brand-400 hover:underline transition">
                          {course.teacher.fullName}
                        </Link>
                      </p>
                      <p className="font-bold text-brand-400">{course.price > 0 ? `${course.price} HTG` : 'Gratuit'}</p>
                    </div>
                    {user?.role === 'ADMIN' ? (
                      <Link href="/admin" className="rounded-full bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/20">Gérer</Link>
                    ) : user?.role === 'TEACHER' ? (
                      <Link href="/dashboard" className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">Mon espace</Link>
                    ) : (
                      <Link href={`/cours/${course.id}`} className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-500">Voir</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}