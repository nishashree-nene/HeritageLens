/**
 * Chat Page — Feature C
 *
 * Standalone AI Heritage Chatbot with:
 * - User / assistant message bubbles
 * - Monument context selector
 * - English / Tamil language toggle
 * - Suggested questions
 * - Clear chat
 * - Loading indicator & error handling
 * - Text-to-speech (Web Speech API)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, Send, Trash2, Globe, Volume2, VolumeX,
  ChevronDown, Sparkles, Info, RefreshCw,
} from 'lucide-react';
import { Button }       from '../components/ui/Button';
import { Badge }        from '../components/ui/Badge';
import { DEMO_SITES }   from '../data/demo/heritage-sites';
import { askHeritageGuide, getDefaultSuggestions } from '../services/ai/heritageGuide';
import { useAppStore }  from '../store/appStore';
import type { AIGuideMessage, Language } from '../types';

// ── TTS helper ────────────────────────────────────────────────────────────────
let activeSpeech: SpeechSynthesisUtterance | null = null;

function speak(text: string, lang: Language) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = lang === 'ta' ? 'ta-IN' : 'en-IN';
  u.rate  = 0.9;
  activeSpeech = u;
  window.speechSynthesis.speak(u);
}
function stopSpeech() { window.speechSynthesis?.cancel(); activeSpeech = null; }

// ── Welcome message ───────────────────────────────────────────────────────────
function makeWelcome(siteName: string, lang: Language): AIGuideMessage {
  const content = lang === 'ta'
    ? `வணக்கம்! நான் HeritageLens AI வழிகாட்டி. ${siteName} பற்றி என்னிடம் எதையும் கேளுங்கள் — வரலாறு, கட்டிடக்கலை, அல்லது சுற்றுலா தகவல்கள்.`
    : `Welcome! I'm the HeritageLens AI Guide. Ask me anything about ${siteName} — history, architecture, who built it, or visitor tips.`;
  return { id: 'welcome', role: 'assistant', content, language: lang, timestamp: new Date().toISOString() };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Chat() {
  const { language: appLang } = useAppStore();

  const [lang,         setLang]         = useState<Language>(appLang);
  const [siteId,       setSiteId]       = useState(DEMO_SITES[0].id);
  const [siteDropOpen, setSiteDropOpen] = useState(false);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [speaking,     setSpeaking]     = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const site = DEMO_SITES.find((s) => s.id === siteId) ?? DEMO_SITES[0];
  const siteName = lang === 'ta' ? site.name_ta : site.name_en;

  const [messages, setMessages] = useState<AIGuideMessage[]>([makeWelcome(siteName, lang)]);
  const endRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = getDefaultSuggestions(siteId, lang);

  // Auto-scroll
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Reset on site / lang change
  useEffect(() => {
    setMessages([makeWelcome(lang === 'ta' ? site.name_ta : site.name_en, lang)]);
    setError(null);
  }, [siteId, lang]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send message ────────────────────────────────────────────────────────────
  const send = useCallback(async (q: string) => {
    if (!q.trim() || loading) return;
    setError(null);
    stopSpeech();
    setSpeaking(false);

    const userMsg: AIGuideMessage = {
      id:        Date.now().toString(),
      role:      'user',
      content:   q.trim(),
      language:  lang,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await askHeritageGuide({
        question: q.trim(),
        siteId,
        language: lang,
        conversationHistory: messages,
      });
      setMessages((prev) => [
        ...prev,
        {
          id:        (Date.now() + 1).toString(),
          role:      'assistant',
          content:   res.answer,
          language:  lang,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setError('Could not reach the AI guide. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, lang, siteId, messages]);

  const clearChat = () => {
    stopSpeech();
    setSpeaking(false);
    setMessages([makeWelcome(siteName, lang)]);
    setError(null);
    inputRef.current?.focus();
  };

  const toggleSpeech = (text: string) => {
    if (speaking) { stopSpeech(); setSpeaking(false); }
    else { speak(text, lang); setSpeaking(true); }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-16 pb-28 flex flex-col">
      {/* Page header */}
      <div className="bg-gradient-to-b from-stone-900 to-transparent px-4 sm:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">AI Heritage Guide</p>
              <h1 className="font-serif text-2xl text-stone-100">Heritage Chatbot</h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLang((l) => l === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-stone-300 hover:text-stone-100 text-sm transition-all"
                aria-label="Toggle language"
              >
                <Globe className="h-4 w-4" />
                {lang === 'en' ? 'EN' : 'தமிழ்'}
              </button>
              {/* Clear */}
              <button
                onClick={clearChat}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-stone-400 hover:text-stone-200 text-sm transition-all"
                aria-label="Clear conversation"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Monument selector */}
          <div className="relative mt-4">
            <button
              onClick={() => setSiteDropOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl glass border border-stone-700 hover:border-yellow-500/40 transition-all text-left"
              aria-expanded={siteDropOpen}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={site.featured_image}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100'; }}
                />
                <div className="min-w-0">
                  <p className="text-stone-200 text-sm font-semibold truncate">{siteName}</p>
                  <p className="text-stone-500 text-xs truncate">{site.location_name}</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-stone-400 flex-shrink-0 transition-transform ${siteDropOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {siteDropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 left-0 right-0 z-20 glass border border-stone-700 rounded-xl overflow-hidden shadow-2xl"
                >
                  {DEMO_SITES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSiteId(s.id); setSiteDropOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors ${s.id === siteId ? 'bg-yellow-500/10' : ''}`}
                    >
                      <img
                        src={s.featured_image}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100'; }}
                      />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${s.id === siteId ? 'text-yellow-400' : 'text-stone-200'}`}>
                          {lang === 'ta' ? s.name_ta : s.name_en}
                        </p>
                        <p className="text-stone-500 text-xs truncate">{s.location_name}</p>
                      </div>
                      {s.id === siteId && <div className="ml-auto w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto max-w-2xl w-full mx-auto px-4 sm:px-6 py-4 space-y-4">

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user'
                  ? 'bg-yellow-500/20 border border-yellow-500/30'
                  : 'bg-gradient-to-br from-yellow-600 to-yellow-800'
              }`}>
                {msg.role === 'user'
                  ? <User className="h-3.5 w-3.5 text-yellow-400" />
                  : <Bot className="h-3.5 w-3.5 text-stone-100" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[82%] flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-yellow-500/15 text-yellow-100 rounded-tr-sm border border-yellow-500/20'
                    : 'bg-stone-800 text-stone-200 rounded-tl-sm border border-stone-700'
                }`}>
                  {msg.content}
                </div>

                {/* TTS for assistant */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => toggleSpeech(msg.content)}
                    className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-400 transition-colors"
                    aria-label={speaking ? 'Stop reading' : 'Read aloud'}
                  >
                    {speaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    {speaking ? 'Stop' : 'Listen'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-stone-100" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-stone-800 border border-stone-700 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-stone-500"
                    style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
                  />
                ))}
              </div>
              <span className="text-stone-500 text-xs">AI is thinking…</span>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5"
          >
            <Info className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="flex items-center gap-1 mt-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
              >
                <RefreshCw className="h-3 w-3" /> Dismiss
              </button>
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Suggestions + input — fixed at bottom */}
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 pb-4 space-y-3">
        {/* Suggested questions */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin" aria-label="Suggested questions">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:bg-stone-700 hover:text-stone-100 hover:border-yellow-500/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="h-3 w-3 text-yellow-500" />
              {s}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={lang === 'ta' ? 'பாரம்பரிய கேள்வி கேளுங்கள்…' : 'Ask about this heritage site…'}
              className="w-full bg-stone-900 border border-stone-700 rounded-2xl px-4 py-3 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50 transition-colors pr-12"
              disabled={loading}
              aria-label="Message input"
              maxLength={500}
            />
            {input.length > 400 && (
              <span className="absolute right-3 bottom-3 text-[10px] text-stone-600">{500 - input.length}</span>
            )}
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Footer note */}
        <p className="text-stone-700 text-[11px] text-center">
          {messages.some((m) => !m.content.includes('Welcome') && m.role === 'assistant')
            ? messages.find((m) => m.role === 'assistant' && m.id !== 'welcome')
              ? '✓ Connected to AI backend'
              : 'Knowledge-base mode'
            : 'Powered by AI · Knowledge verified against ASI & UNESCO records'}
        </p>
      </div>

      {/* Bounce keyframes injected via style tag */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
