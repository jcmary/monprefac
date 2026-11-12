'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.role === 'ADMIN') setIsAdmin(true);
        })
        .catch(() => {
          // On ignore l'erreur si le serveur est éteint
        });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(err.message || 'Erreur serveur');
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  if (isAdmin) return null;

  return (
    <section id="contact" className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">Contact</p>
          <h2 className="mt-2 font-serif text-3xl text-blue-900">Une question ?</h2>
          <p className="mt-3 text-slate-500">
            Ecris-nous et notre equipe te repond sous 24 h.
          </p>
          <ul className="mt-8 space-y-3 text-sm font-medium">
            <li>contact@monprefac.com</li>
            <li>+509 XX XX XXXX</li>
            <li>Port-au-Prince, Haiti</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Nom complet
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Email
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Sujet
            <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold text-blue-900">
            Message
            <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-3 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
          <button type="submit" disabled={status === 'loading'} className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:opacity-50">
            {status === 'loading' ? 'Envoi...' : 'Envoyer'}
          </button>
          {status === 'success' && <p className="text-center text-sm font-semibold text-green-700">Merci ! Nous te recontacterons sous 24 h.</p>}
          {status === 'error' && <p className="text-center text-sm font-semibold text-red-700">{errorMsg}</p>}
        </form>
      </div>
    </section>
  );
}