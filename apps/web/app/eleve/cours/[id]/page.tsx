'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Fonction pour transformer un lien YouTube/Vimeo en iframe
const getEmbedUrl = (text: string) => {
  const ytMatch = text.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  
  const vimeoMatch = text.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  
  return null;
};

export default function StudentCourseViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) setActiveLesson(data.lessons[0]);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500">Chargement...</div>;
  if (!course) return <div className="p-12 text-center text-red-400">Cours introuvable</div>;

  const embedUrl = activeLesson ? getEmbedUrl(activeLesson.content) : null;

  return (
    <main className="min-h-screen text-white">
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <button onClick={() => router.push('/eleve')} className="mb-8 text-sm font-semibold text-brand-400 hover:text-brand-300 hover:underline">← Retour à mon espace</button>
        
        <h1 className="font-serif text-3xl text-white mb-8 md:text-4xl">{course.title}</h1>

        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1 glass-card rounded-2xl p-4 md:p-6 h-fit">
            <h2 className="font-bold text-white mb-6 px-2 text-sm uppercase tracking-wider">Programme</h2>
            <ul className="flex flex-col gap-2">
              {course.lessons?.map((lesson: any, index: number) => (
                <li key={lesson.id}>
                  <button 
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${activeLesson?.id === lesson.id ? 'bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                  >
                    {index + 1}. {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 glass-card rounded-2xl p-6 md:p-10 min-h-[500px]">
            {activeLesson ? (
              <div>
                <h2 className="font-serif text-3xl text-white mb-8">{activeLesson.title}</h2>
                
                {/* LECTEUR VIDÉO OU TEXTE */}
                {embedUrl ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-8 bg-black">
                    <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={activeLesson.title}></iframe>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap mb-10 leading-relaxed">
                    {activeLesson.content}
                  </div>
                )}
                
                {activeLesson.fileUrl && (
                  <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">📎</span>
                      <div>
                        <p className="font-semibold text-white">Ressource jointe</p>
                        <p className="text-xs text-slate-400">Clique pour télécharger ou ouvrir</p>
                      </div>
                    </div>
                    <a href={activeLesson.fileUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-500/20 px-6 py-2.5 text-sm font-bold text-brand-400 hover:bg-brand-500/30 transition">Ouvrir</a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 text-center mt-20">Sélectionne une leçon pour commencer.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}