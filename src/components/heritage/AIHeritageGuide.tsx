import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Volume2, Loader2, Bot, User, Globe } from 'lucide-react';
import { askHeritageGuide, getDefaultSuggestions } from '../../services/ai/heritageGuide';
import { speechService } from '../../services/speech/speechService';
import { useAppStore } from '../../store/appStore';
import type { AIGuideMessage, Language } from '../../types';

export function AIHeritageGuide({ siteId, siteName, onClose }: { siteId: string; siteName: string; onClose: () => void }) {
  const { language: appLang } = useAppStore();
  const [lang, setLang] = useState<Language>(appLang);
  const welcome = lang === 'ta'
    ? `வணக்கம்! நான் HeritageLens AI வழிகாட்டி. ${siteName} பற்றி என்னிடம் எதையும் கேளுங்கள்.`
    : `Welcome! I'm the HeritageLens AI Guide. Ask me anything about ${siteName} — history, architecture, or nearby sites.`;
  const [messages, setMessages] = useState<AIGuideMessage[]>([{ id: 'w', role: 'assistant', content: welcome, language: lang, timestamp: new Date().toISOString() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestions = getDefaultSuggestions(siteId, lang);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async (q: string) => {
    if (!q.trim() || loading) return;
    setMessages((p) => [...p, { id: Date.now().toString(), role: 'user', content: q, language: lang, timestamp: new Date().toISOString() }]);
    setInput(''); setLoading(true);
    try {
      const res = await askHeritageGuide({ question: q, siteId, language: lang, conversationHistory: messages });
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, language: lang, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages((p) => [...p, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, could not process your request. Please try again.', language: lang, timestamp: new Date().toISOString() }]);
    } finally { setLoading(false); }
  };

  const toggleLang = () => {
    const nl = lang === 'en' ? 'ta' : 'en';
    setLang(nl);
    const nw = nl === 'ta' ? `வணக்கம்! ${siteName} பற்றி கேளுங்கள்.` : `Welcome! Ask me about ${siteName}.`;
    setMessages([{ id: 'w-' + nl, role: 'assistant', content: nw, language: nl, timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }} className="relative w-full sm:max-w-lg glass rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"><Bot className="h-4 w-4 text-black" /></div>
            <div><p className="text-stone-100 text-sm font-semibold">HeritageLens AI Guide</p><p className="text-stone-500 text-xs">{siteName} · Demo Mode</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5 text-xs"><Globe className="h-3.5 w-3.5" />{lang === 'en' ? 'EN' : 'தமிழ்'}</button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5"><X className="h-4 w-4" /></button>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-stone-800 border border-stone-700'}`}>
                  {m.role === 'user' ? <User className="h-3.5 w-3.5 text-yellow-400" /> : <Bot className="h-3.5 w-3.5 text-stone-400" />}
                </div>
                <div className={`max-w-[80%] flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2.5 rounded-xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-yellow-500/15 text-yellow-100 rounded-tr-sm' : 'bg-stone-800 text-stone-200 rounded-tl-sm'}`}>{m.content}</div>
                  {m.role === 'assistant' && <button onClick={() => speechService.speak(m.content, { lang: lang === 'ta' ? 'ta-IN' : 'en-IN', rate: 0.9 })} className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-400 transition-colors"><Volume2 className="h-3 w-3" />Listen</button>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center"><Bot className="h-3.5 w-3.5 text-stone-400" /></div>
              <div className="px-3 py-2.5 rounded-xl bg-stone-800 rounded-tl-sm"><Loader2 className="h-4 w-4 text-stone-400 animate-spin" /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {/* Suggestions */}
        <div className="px-4 pb-2"><div className="flex gap-2 overflow-x-auto pb-1">
          {suggestions.slice(0, 3).map((s) => (
            <button key={s} onClick={() => send(s)} disabled={loading} className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:bg-stone-700 hover:text-stone-100 transition-all disabled:opacity-50">{s}</button>
          ))}
        </div></div>
        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-white/8">
          <div className="flex gap-2">
            <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder={lang === 'ta' ? 'கேள்வி கேளுங்கள்...' : 'Ask about this heritage site...'}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50 transition-colors" disabled={loading} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="p-2.5 rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all" aria-label="Send"><Send className="h-4 w-4" /></button>
          </div>
          <p className="text-stone-700 text-xs mt-1.5 text-center">Knowledge-base responses · Demo mode</p>
        </div>
      </motion.div>
    </div>
  );
}
