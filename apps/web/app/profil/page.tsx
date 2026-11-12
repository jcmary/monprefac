'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', bio: '' });
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/connexion'); return; }

    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setForm({ fullName: data.fullName || '', bio: data.bio || '' });
        setEmail(data.email);
        setRole(data.role);
        setLoading(false);
      });
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('✅ Profil mis à jour avec succès !');
        // Mettre à jour le cache local
        const cachedUser = JSON.parse(localStorage.getItem('monprefac_user') || '{}');
        localStorage.setItem('monprefac_user', JSON.stringify({ ...cachedUser, ...form }));
      } else {
        setMessage('❌ Erreur lors de la mise à jour.');
      }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-20">
        <h1 className="font-serif text-3xl text-white mb-10 md:text-4xl">Mon Profil</h1>

        <div className="glass-card rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-300">Email (non modifiable)</label>
              <input type="email" value={email} disabled className="mt-1 w-full rounded-xl px-4 py-3 opacity-50 cursor-not-allowed" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300">Rôle</label>
              <input type="text" value={role === 'TEACHER' ? 'Professeur' : role === 'ADMIN' ? 'Administrateur' : 'Élève'} disabled className="mt-1 w-full rounded-xl px-4 py-3 opacity-50 cursor-not-allowed" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-300">Nom complet</label>
              <input type="text" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full rounded-xl px-4 py-3" />
            </div>

            {role === 'TEACHER' && (
              <div>
                <label className="text-sm font-semibold text-slate-300">Bio (Présentation pour tes élèves)</label>
                <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Ex: Agrégé de mathématiques, 10 ans d'expérience..." className="mt-1 w-full rounded-xl px-4 py-3" />
              </div>
            )}

            {message && <p className="text-sm font-semibold text-emerald-400">{message}</p>}

            <button type="submit" disabled={saving} className="mt-4 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}