'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ManageCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchCourse = () => {
    fetch(`${API_URL}/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const token = getToken();
    
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('content', form.content);
    if (file) formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/courses/${id}/lessons`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        alert('Leçon ajoutée !');
        setForm({ title: '', content: '' });
        setFile(null);
        fetchCourse();
      } else {
        alert("Erreur lors de l'ajout");
      }
    } catch { alert('Erreur réseau'); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;
  if (!course) return <div className="p-12 text-center text-red-400">Cours introuvable</div>;

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-20">
        
        <button onClick={() => router.push('/dashboard')} className="mb-8 text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">
          ← Retour à mon espace
        </button>

        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="font-serif text-3xl text-white md:text-4xl">{course.title}</h1>
            <p className="text-slate-400 mt-2">{course.description}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold w-fit ${course.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
            {course.status === 'PUBLISHED' ? 'En ligne' : 'Brouillon'}
          </span>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Formulaire d'ajout */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="font-serif text-2xl text-white mb-6">Ajouter une leçon</h2>
            <form onSubmit={handleAddLesson} className="flex flex-col gap-5">
              <input
                type="text" placeholder="Titre de la leçon (ex: Chapitre 1)" required
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl px-4 py-3"
              />
              <textarea
                placeholder="Contenu texte ou lien YouTube..." required rows={5}
                value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="rounded-xl px-4 py-3"
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-300">Fichier joint (Image ou PDF)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-400 hover:file:bg-brand-500/20"
                />
              </div>

              <button type="submit" disabled={uploading} className="mt-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:opacity-50">
                {uploading ? 'Envoi en cours...' : 'Ajouter la leçon'}
              </button>
            </form>
          </div>

          {/* Liste des leçons */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="font-serif text-2xl text-white mb-6">Contenu ({course.lessons?.length || 0})</h2>
            {course.lessons?.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune leçon pour le moment.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {course.lessons?.map((lesson: any, index: number) => (
                  <li key={lesson.id} className="rounded-xl border border-white/5 bg-white/5 p-5">
                    <p className="font-semibold text-white">{index + 1}. {lesson.title}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 mt-2">{lesson.content}</p>
                    {lesson.fileUrl && (
                      <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-lg hover:bg-brand-500/20 transition">
                        📎 Voir la pièce jointe
                      </a>
                    )}
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