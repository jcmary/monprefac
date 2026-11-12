'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function LatestCourses() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/courses`).then((res) => res.json()).then((data) => setCourses(data.slice(0, 3))).catch(() => {});
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-500">Nouveautés</p>
            <h2 className="mt-2 font-serif text-2xl text-white md:text-4xl">Les derniers cours en ligne</h2>
          </div>
          <Link href="/cours" className="text-sm font-semibold text-brand-500 hover:text-brand-400 hover:underline">Voir tout le catalogue →</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
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
                
                {course.reviewCount > 0 && (
                  <div className="flex items-center gap-1 text-sm text-amber-400 font-bold mb-3">
                    <span>⭐ {course.averageRating}</span>
                    <span className="text-xs text-slate-500 font-normal">({course.reviewCount})</span>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <p className="text-xs text-slate-500">Par {course.teacher.fullName}</p>
                  <p className="font-bold text-brand-400">{course.price > 0 ? `${course.price} HTG` : 'Gratuit'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}