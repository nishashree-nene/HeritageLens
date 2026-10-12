import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppStore } from '../../store/appStore';
import { scoreToGrade } from '../../utils/helpers';
import type { Quiz } from '../../types';

export function QuizSection({ quiz, onClose }: { quiz: Quiz; onClose: () => void }) {
  const { language, setQuizScore, earnBadge } = useAppStore();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [complete, setComplete] = useState(false);
  const questions = quiz.questions || [];
  const question = questions[current];
  if (!question) return null;

  const confirm = () => {
    if (!selected) return;
    const opt = question.options?.find((o) => o.id === selected);
    setAnswered(true);
    setAnswers((p) => ({ ...p, [current]: { selected, correct: opt?.is_correct ?? false } }));
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      const score = Object.values({ ...answers, [current]: { selected: selected!, correct: question.options?.find((o) => o.id === selected)?.is_correct ?? false } }).filter((a) => a.correct).length;
      setQuizScore(quiz.id, score);
      if (score >= questions.length) earnBadge('badge-003');
      setComplete(true);
    } else { setCurrent((c) => c + 1); setSelected(null); setAnswered(false); }
  };

  const score = Object.values(answers).filter((a) => a.correct).length;
  const grade = scoreToGrade(score, questions.length);

  if (complete) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md glass rounded-2xl overflow-hidden p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4"><Trophy className="h-8 w-8 text-yellow-400" /></div>
        <h2 className="font-serif text-2xl text-stone-100 mb-1">Quiz Complete!</h2>
        <p className="text-stone-400 text-sm mb-4">{quiz.title}</p>
        <div className="heritage-card p-6 mb-4">
          <div className={`text-5xl font-bold ${grade.color} mb-2`}>{grade.grade}</div>
          <div className="text-stone-100 text-xl font-semibold mb-1">{score} / {questions.length}</div>
          <div className="text-stone-400 text-sm">{grade.label}</div>
        </div>
        <div className="space-y-2 mb-6 text-left">
          {questions.map((q, i) => {
            const ans = answers[i];
            const correctOpt = q.options?.find((o) => o.is_correct);
            return (
              <div key={q.id} className="flex items-start gap-2 p-3 rounded-xl bg-stone-900/60">
                {ans?.correct ? <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-stone-300 text-xs font-medium mb-0.5">{language === 'ta' ? q.question_ta : q.question}</p>
                  {!ans?.correct && <p className="text-emerald-400 text-xs">Correct: {language === 'ta' ? correctOpt?.option_text_ta : correctOpt?.option_text}</p>}
                  <p className="text-stone-600 text-xs mt-0.5">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" icon={<RotateCcw className="h-4 w-4" />} onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setAnswers({}); setComplete(false); }}>Retry</Button>
          <Button variant="gold" className="flex-1" onClick={onClose}>Done</Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div><p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-0.5">Heritage Quiz</p><p className="text-stone-300 text-sm font-semibold">{quiz.title}</p></div>
          <div className="flex items-center gap-3"><span className="text-stone-400 text-sm">{current + 1} / {questions.length}</span><button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5"><X className="h-4 w-4" /></button></div>
        </div>
        <div className="h-1 bg-stone-800"><div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
        <div className="p-6">
          <Badge variant="stone" className="mb-4">{question.question_type.replace('_', ' ')}</Badge>
          <h2 className="font-serif text-stone-100 text-lg font-semibold mb-6 leading-snug">{language === 'ta' ? question.question_ta : question.question}</h2>
          <div className="space-y-3 mb-6">
            {question.options?.map((opt) => {
              const isSel = selected === opt.id;
              let cls = 'w-full p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ';
              if (!answered) cls += isSel ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-200' : 'border-stone-700 text-stone-300 hover:border-stone-600 hover:bg-white/3';
              else if (opt.is_correct) cls += 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200';
              else if (isSel && !opt.is_correct) cls += 'border-red-500/60 bg-red-500/10 text-red-300';
              else cls += 'border-stone-700 text-stone-500 opacity-60';
              return (
                <button key={opt.id} onClick={() => !answered && setSelected(opt.id)} disabled={answered} className={cls}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${answered && opt.is_correct ? 'border-emerald-500 bg-emerald-500/20' : answered && isSel ? 'border-red-500 bg-red-500/20' : isSel ? 'border-yellow-400' : 'border-stone-600'}`}>
                      {answered && opt.is_correct && <CheckCircle className="h-3 w-3 text-emerald-400" />}
                      {answered && isSel && !opt.is_correct && <XCircle className="h-3 w-3 text-red-400" />}
                      {!answered && isSel && <div className="w-2 h-2 rounded-full bg-yellow-400" />}
                    </div>
                    {language === 'ta' ? opt.option_text_ta : opt.option_text}
                  </div>
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <p className="text-stone-300 text-sm leading-relaxed"><span className="text-yellow-400 font-semibold">Explanation: </span>{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!answered ? (
            <Button variant="gold" className="w-full" onClick={confirm} disabled={!selected}>Confirm Answer</Button>
          ) : (
            <Button variant="gold" className="w-full" icon={<ChevronRight className="h-4 w-4" />} onClick={next}>
              {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
