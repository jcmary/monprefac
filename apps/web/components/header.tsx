'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, getUser, removeToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    if (!token) { setLoading(false); setUser(null); return; }

    const cachedUser = getUser();
    if (cachedUser) { setUser(cachedUser); setLoading(false); }

    fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { 
        if (res.ok) return res.json(); 
        if (res.status === 401) throw new Error('401'); 
        throw new Error('NetworkError'); 
      })
      .then((data) => {
        setUser(data);
        localStorage.setItem('monprefac_user', JSON.stringify(data));
      })
      .catch((err) => { 
        if (err.message === '401') { removeToken(); setUser(null); } 
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white transition hover:opacity-80">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 text-white shadow-sm md:h-9 md:w-9">M</span>
          <span className="text-sm md:text-base">Monprefac</span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/cours" className="hover:text-white transition">Catalogue</Link>
          
          {mounted && !user && (
            <>
              <Link href="/#comment" className="hover:text-white transition">Comment ça marche</Link>
              <Link href="/#contact" className="hover:text-white transition">Contact</Link>
            </>
          )}
          
          {mounted && user?.role === 'ADMIN' && (
            <Link href="/admin" className="font-bold text-orange-400 hover:text-orange-300">Admin</Link>
          )}
          {mounted && user?.role === 'TEACHER' && (
            <Link href="/dashboard" className="font-bold text-brand-500 hover:text-brand-400">Espace Prof</Link>
          )}
          {mounted && user?.role === 'STUDENT' && (
            <Link href="/eleve" className="font-bold text-brand-500 hover:text-brand-400">Mon Espace</Link>
          )}
          
          {!mounted || loading ? (
            <span className="text-slate-600">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-300">
                👤 {user.fullName ? user.fullName.split(' ')[0] : user.email.split('@')[0]} 
              </span>
              <button onClick={handleLogout} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400">Déconnexion</button>
            </div>
          ) : (
            <Link href="/connexion" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500">Connexion</Link>
          )}
        </nav>

        {/* BOUTON MOBILE */}
        <div className="flex items-center gap-2 md:hidden">
          {!mounted || loading ? (
            <span className="text-slate-600">...</span>
          ) : user ? (
            <>
              <Link 
                href={user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/dashboard' : '/eleve'} 
                className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white"
              >
                Mon espace
              </Link>
              <button onClick={handleLogout} className="rounded-full bg-red-500/10 p-2 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </>
          ) : (
            <Link 
              href="/connexion" 
              className="rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}