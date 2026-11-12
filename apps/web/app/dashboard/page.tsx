'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', price: 0, subject: '', exam: '' });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = () => {
    const token = getToken();
    fetch(`${API_URL}/courses/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => { setCourses(data); setLoading(false); })
      .catch(() => router.push('/'));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/connexion'); return; }
    fetchCourses();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = getToken();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('price', form.price.toString());
    formData.append('subject', form.subject);
    formData.append('exam', form.exam);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert('Cours créé avec succès !');
        setForm({ title: '', description: '', price: 0, subject: '', exam: '' });
        setCoverImage(null);
        fetchCourses(); // Met à jour la liste sans recharger la page
      } else {
        const errorData = await res.json();
        alert('Erreur: ' + (errorData.message || 'Impossible de créer le cours'));
      }
    } catch (error) {
      alert('Erreur réseau. Vérifie que le serveur est allumé.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <h1 className="font-serif text-3xl text-white mb-10 md:text-5xl">Mon Espace <span className="gradient-text">Professeur</span></h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="font-serif text-2xl text-white mb-6">Créer un nouveau cours</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input type="text" placeholder="Titre du cours" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl px-4 py-3" />
              <textarea placeholder="Description" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl px-4 py-3" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Matière" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-xl px-4 py-3" />
                <input type="text" placeholder="Concours" required value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} className="rounded-xl px-4 py-3" />
              </div>
              <input type="number" placeholder="Prix (HTG)" required min={0} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl px-4 py-3" />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Image de couverture (optionnel)</label>
                <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-400 hover:file:bg-brand-500/20" />
              </div>

              <button type="submit" disabled={submitting} className="mt-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:opacity-50">
                {submitting ? 'Création...' : 'Créer le cours'}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="font-serif text-2xl text-white mb-6">Mes cours</h2>
            {loading ? <p className="text-slate-400">Chargement...</p> : courses.length === 0 ? <p className="text-slate-400 text-sm">Aucun cours.</p> : (
              <ul className="flex flex-col gap-4">
                {courses.map((c) => (
                  <li key={c.id} className="rounded-xl border border-white/5 bg-white/5 p-4 flex gap-4 items-center">
                    {c.coverImage ? (
                      <img src={c.coverImage} alt={c.title} className="w-16 h-16 rounded-lg object-cover bg-slate-800" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl">📚</div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-white">{c.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{c.price} HTG · {c._count?.lessons || 0} leçons · {c._count?.enrollments || 0} élèves</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {c.status === 'PUBLISHED' ? 'En ligne' : 'Brouillon'}
                      </span>
                      <Link href={`/dashboard/${c.id}`} className="text-xs font-bold text-brand-400 hover:underline">Gérer →</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}