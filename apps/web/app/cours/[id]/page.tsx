'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  
  // Formulaire d'avis
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadData = async () => {
    const token = getToken();
    try {
      const courseRes = await fetch(`${API_URL}/courses/${id}`);
      const courseData = await courseRes.json();
      setCourse(courseData);

      if (token) {
        const userRes = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const userData = userRes.ok ? await userRes.json() : null;
        setUser(userData);

        if (userData?.role === 'STUDENT') {
          const enrollRes = await fetch(`${API_URL}/courses/my-enrollments`, { headers: { Authorization: `Bearer ${token}` } });
          const enrollments = enrollRes.ok ? await enrollRes.json() : [];
          const enrolled = Array.isArray(enrollments) && enrollments.some((e: any) => e.courseId === id);
          setIsEnrolled(enrolled);

          if (enrolled && courseData.reviews) {
            const alreadyReviewed = courseData.reviews.some((r: any) => r.studentId === userData.userId);
            setHasReviewed(alreadyReviewed);
          }
        }
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleEnroll = async () => {
    if (!user) { router.push('/connexion'); return; }
    setEnrolling(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/courses/${id}/enroll`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setIsEnrolled(true); router.refresh(); }
      else { const err = await res.json(); alert(err.message || 'Erreur'); }
    } finally { setEnrolling(false); }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/courses/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        alert('Merci pour ton avis !');
        setHasReviewed(true);
        loadData(); // Recharger pour voir le nouvel avis
      } else {
        const err = await res.json();
        alert(err.message || 'Erreur');
      }
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;
  if (!course) return <div className="p-12 text-center text-red-400">Cours introuvable</div>;

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        <div className="mb-6 flex gap-2">
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-500">{course.subject}</span>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-400">{course.exam}</span>
        </div>

        <h1 className="mb-2 font-serif text-3xl text-white md:text-5xl">{course.title}</h1>
        
        {/* ETOILES ET PROF */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4 text-lg text-slate-400">
          <p>
            Proposé par{' '}
            <Link href={`/prof/${course.teacher.id}`} className="font-bold text-white hover:text-brand-400 hover:underline transition">
              {course.teacher.fullName}
            </Link>
          </p>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            {course.averageRating > 0 ? (
              <>
                <span>⭐ {course.averageRating} / 5</span>
                <span className="text-sm text-slate-500 font-normal">({course.reviewCount} avis)</span>
              </>
            ) : (
              <span className="text-sm text-slate-500 font-normal">Aucun avis pour le moment</span>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="mb-4 font-serif text-2xl text-white">À propos de ce cours</h2>
              <p className="whitespace-pre-wrap text-slate-400 leading-relaxed">{course.description}</p>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="mb-4 font-serif text-2xl text-white">Programme</h2>
              <ul className="divide-y divide-white/5">
                {course.lessons?.map((lesson: any, index: number) => (
                  <li key={lesson.id} className="py-4 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-slate-300">{index + 1}</span>
                    <span className="font-medium text-slate-200">{lesson.title}</span>
                    {!isEnrolled && !isTeacher && !isAdmin && <span className="ml-auto text-slate-600">🔒</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* SECTION AVIS */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="mb-6 font-serif text-2xl text-white">Avis des élèves</h2>
              
              {/* Formulaire d'avis (si élève inscrit et pas encore noté) */}
              {isEnrolled && !hasReviewed && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-semibold text-white mb-4">Laisse un avis sur ce cours</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">Note</label>
                      <div className="flex gap-2 text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={star <= reviewForm.rating ? 'text-amber-400' : 'text-slate-600'}>★</button>
                        ))}
                      </div>
                    </div>
                    <textarea required rows={3} placeholder="Ton commentaire..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} className="rounded-xl px-4 py-3" />
                    <button type="submit" disabled={submittingReview} className="self-start rounded-full bg-brand-600 px-6 py-2 text-sm font-bold text-white hover:bg-brand-500 disabled:opacity-50">
                      {submittingReview ? 'Envoi...' : 'Publier mon avis'}
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des avis */}
              {course.reviews?.length === 0 ? (
                <p className="text-slate-500">Aucun avis pour le moment.</p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {course.reviews?.map((review: any) => (
                    <li key={review.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center font-bold text-brand-400">
                          {review.student.fullName ? review.student.fullName.charAt(0) : 'E'}
                        </div>
                        <span className="font-semibold text-white">{review.student.fullName || 'Élève anonyme'}</span>
                        <span className="text-amber-400 text-sm ml-auto">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      </div>
                      <p className="text-slate-300 text-sm ml-11">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="glass sticky top-24 rounded-3xl p-6 md:p-8 border border-white/10">
              <p className="text-center text-3xl font-bold text-white mb-8">
                {course.price > 0 ? `${course.price} HTG` : 'Gratuit'}
              </p>
              
              {isAdmin ? (
                <button onClick={() => router.push('/admin')} className="w-full rounded-full border border-orange-500/30 bg-orange-500/10 px-6 py-3 font-semibold text-orange-400 hover:bg-orange-500/20 transition">Gérer sur le tableau de bord</button>
              ) : isTeacher ? (
                <button onClick={() => router.push('/dashboard')} className="w-full rounded-full border border-brand-500/30 bg-brand-500/10 px-6 py-3 font-semibold text-brand-400 hover:bg-brand-500/20 transition">Aller à mon espace prof</button>
              ) : isEnrolled ? (
                <button onClick={() => router.push(`/eleve/cours/${id}`)} className="w-full rounded-full bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500">Accéder au cours</button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="w-full rounded-full bg-brand-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:opacity-50">
                  {enrolling ? 'Inscription...' : "S'inscrire"}
                </button>
              )}
              
              <ul className="mt-8 space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Accès à vie</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {course.lessons?.length || 0} leçons</li>
                <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> {course._count?.enrollments || 0} élèves inscrits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}