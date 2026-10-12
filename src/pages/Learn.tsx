import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { QuizSection } from '../components/quiz/QuizSection';
import { DEMO_QUIZZES, DEMO_SITES } from '../data/demo/heritage-sites';
import { DEMO_BADGES } from '../data/demo/badges';
import { useAppStore } from '../store/appStore';

export default function Learn() {
  const { quizScores, earnedBadges } = useAppStore();
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const quiz = activeQuiz ? DEMO_QUIZZES.find((q) => q.id === activeQuiz) : null;

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="bg-gradient-to-b from-stone-900 to-transparent py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">Learn</p>
          <h1 className="font-serif text-4xl text-stone-100 mb-3">Heritage Education</h1>
          <p className="text-stone-400 text-base">Test your knowledge and earn heritage badges</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h2 className="font-serif text-xl text-stone-100 mb-4">Heritage Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEMO_QUIZZES.map((q, i) => {
              const site = DEMO_SITES.find((s) => s.id === q.heritage_site_id);
              const score = quizScores[q.id];
              const done = score !== undefined;
              return (
                <motion.div key={q.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="heritage-card overflow-hidden">
                  {site && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={site.featured_image} alt={site.name_en} className="w-full h-full object-cover opacity-60" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=400&q=80'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {done && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-300 text-xs font-semibold">{score}/{q.questions?.length}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-serif text-stone-100 text-base font-semibold mb-1">{q.title}</h3>
                    <p className="text-stone-500 text-xs mb-3">{q.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-600 text-xs">{q.questions?.length} questions</span>
                      <Button variant="gold" size="sm" icon={done ? <CheckCircle className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />} onClick={() => setActiveQuiz(q.id)}>{done ? 'Retake' : 'Start Quiz'}</Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-xl text-stone-100 mb-4">Heritage Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DEMO_BADGES.map((badge) => {
              const earned = earnedBadges.includes(badge.id);
              return (
                <div key={badge.id} className={`heritage-card p-4 text-center transition-all ${earned ? 'border-yellow-500/25' : 'opacity-50'}`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-stone-200 text-xs font-semibold mb-1">{badge.name}</p>
                  <p className="text-stone-600 text-xs leading-tight">{badge.description}</p>
                  {earned && <div className="mt-2 flex items-center justify-center gap-1 text-yellow-400 text-xs"><Star className="h-3 w-3 fill-yellow-400" />Earned</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="heritage-card p-6 text-center">
          <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
          <h3 className="font-serif text-stone-100 text-lg mb-2">Explore to Learn More</h3>
          <p className="text-stone-400 text-sm mb-4">Visit heritage sites and complete quizzes to unlock all badges</p>
          <Link to="/explore"><Button variant="gold" iconRight={<ArrowRight className="h-4 w-4" />}>Explore Heritage</Button></Link>
        </div>
      </div>
      {quiz && <QuizSection quiz={quiz} onClose={() => setActiveQuiz(null)} />}
    </div>
  );
}
