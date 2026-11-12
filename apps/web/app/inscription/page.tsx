'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      router.push('/connexion');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-blue-900">Créer un compte</h1>
          <p className="mt-2 text-sm text-slate-500">Rejoins la communauté Monprefac</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Nom complet
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Mot de passe
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Je suis...
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="STUDENT">Élève</option>
              <option value="TEACHER">Professeur</option>
            </select>
          </label>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link href="/connexion" className="font-semibold text-blue-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}