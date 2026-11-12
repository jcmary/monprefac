'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setToken, setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      setToken(data.access_token);
      setUser(data.user); // On sauvegarde l'utilisateur localement
      
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user.role === 'TEACHER') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-blue-900">Connexion</h1>
          <p className="mt-2 text-sm text-slate-500">Accède à ton espace Monprefac</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Mot de passe
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="font-semibold text-blue-700 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}