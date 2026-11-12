'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser } from '@/lib/auth';

export function RoleGuard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    if (!token) return;

    // Redirection immédiate basée sur le cache pour la rapidité
    const cachedUser = getUser();
    if (cachedUser?.role === 'ADMIN') {
      router.push('/admin');
      return;
    }
    if (cachedUser?.role === 'TEACHER') {
      router.push('/dashboard');
      return;
    }

    // Vérification en arrière-plan (au cas où)
    fetch('http://localhost:4000/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.role === 'ADMIN') router.push('/admin');
        if (data?.role === 'TEACHER') router.push('/dashboard');
      })
      .catch(() => {});
  }, [router]);

  return null;
}