import Link from 'next/link';
import { ContactForm } from '@/components/contact-form';
import { Header } from '@/components/header';
import { RoleGuard } from '@/components/role-guard';
import { LatestCourses } from '@/components/latest-courses';

const stats = [
  { value: '250+', label: 'Élèves accompagnés' },
  { value: '40+', label: 'Professeurs qualifiés' },
  { value: '12', label: 'Matières couvertes' },
  { value: '92%', label: 'Taux de réussite' },
];

const subjects = [
  { name: 'Mathématiques', icon: '📐' },
  { name: 'Physique', icon: '⚛️' },
  { name: 'Chimie', icon: '🧪' },
  { name: 'Biologie', icon: '🧬' },
  { name: 'Français & Littérature', icon: '📖' },
  { name: 'Philosophie', icon: '🧠' },
  { name: 'Anglais', icon: '🌍' },
  { name: 'Histoire-Géographie', icon: '🏛️' },
  { name: 'Économie', icon: '📊' },
  { name: 'SVT', icon: '🌱' },
];

const steps = [
  { n: '1', title: 'Crée ton profil', desc: 'Indique ta classe, ton concours visé et les matières à renforcer.' },
  { n: '2', title: 'Choisis ton cours', desc: 'Parcours le catalogue, compare les profs et les programmes.' },
  { n: '3', title: 'Prépare ton concours', desc: 'Cours en ligne, exercices corrigés, suivi personnalisé.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen text-white">
      <RoleGuard />
      <Header />

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-brand-500 shadow-sm md:text-sm">
              🎓 Spécial terminale & concours
            </span>
            <h1 className="mt-6 font-serif text-3xl leading-tight text-white md:text-5xl lg:text-6xl">
              Réussis ton concours avec <span className="gradient-text">de vrais professeurs</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-slate-400 md:text-lg">
              Monprefac met en relation les élèves qui terminent leurs études classiques avec des profs qualifiés, pour une préparation ciblée, en ligne et à ton rythme.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cours" className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 md:text-base">
                Voir le catalogue
              </Link>
              <Link href="/#comment" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 md:text-base">
                Comment ça marche
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-4 text-xs font-medium text-slate-300 md:text-sm">
              <li className="flex items-center gap-1.5"><span className="text-brand-500">✓</span> Profs vérifiés</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-500">✓</span> Cours en ligne</li>
              <li className="flex items-center gap-1.5"><span className="text-brand-500">✓</span> Accès immédiat</li>
            </ul>
          </div>
          <div className="hidden md:block">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-500/20 text-2xl text-brand-500">
                  P
                </div>
                <div>
                  <p className="font-semibold text-white">Prof. Jean-Baptiste</p>
                  <p className="text-sm text-slate-400">Mathématiques · 12 ans d&apos;exp.</p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                  En ligne
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 text-center md:grid-cols-4 md:gap-8 md:p-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="gradient-text font-serif text-3xl font-bold md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs text-slate-400 md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LatestCourses />

      <section id="comment" className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-500">Simple et rapide</p>
            <h2 className="mt-2 font-serif text-2xl text-white md:text-4xl">Comment ça marche</h2>
            <p className="mt-3 text-sm text-slate-400 md:text-base">Trois étapes pour commencer ta préparation, sans stress.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="glass-card rounded-2xl p-6 text-center md:p-8">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-500/10 font-serif text-xl font-bold text-brand-500">
                  {s.n}
                </div>
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-500">Programme</p>
            <h2 className="mt-2 font-serif text-2xl text-white md:text-4xl">Les matières couvertes</h2>
            <p className="mt-3 text-sm text-slate-400 md:text-base">Toutes les matières clés des concours d&apos;admission.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {subjects.map((s) => (
              <div key={s.name} className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-brand-500/40 hover:bg-white/10">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-sm font-medium text-slate-200">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-500">Tu es prof ?</p>
          <h2 className="mt-2 font-serif text-2xl text-white md:text-4xl">Rejoins Monprefac et partage ton savoir</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 md:text-base">Crée tes cours, fixe tes prix, et touche tes revenus en toute simplicité.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: '📚', title: 'Publie tes cours', desc: 'Vidéos, PDF, ressources — tout est sécurisé.' },
              { icon: '💳', title: 'Fixe tes prix', desc: 'Tu décides de la valeur de ton travail.' },
              { icon: '💰', title: 'Touche tes gains', desc: 'Retire ton argent quand tu veux.' },
            ].map((p) => (
              <div key={p.title} className="glass-card rounded-2xl p-6 md:p-8">
                <div className="text-4xl">{p.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/inscription" className="mt-10 inline-block rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 md:text-base">
            Devenir prof sur Monprefac
          </Link>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}