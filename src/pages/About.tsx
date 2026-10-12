import { motion } from 'framer-motion';
import { Eye, Shield, BookOpen, Users, Globe, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-24 max-w-3xl mx-auto px-4 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mx-auto mb-4"><Eye className="h-8 w-8 text-black" /></div>
          <h1 className="font-serif text-4xl text-stone-100 mb-3">About HeritageLens</h1>
          <p className="text-yellow-500 text-sm font-semibold tracking-wider">"See the Past. Understand the Present. Preserve the Future."</p>
        </div>
        <div className="space-y-6">
          <div className="heritage-card p-6"><h2 className="font-serif text-xl text-stone-100 mb-3">Our Mission</h2><p className="text-stone-400 leading-relaxed">HeritageLens is an AI-powered augmented reality platform for cultural heritage preservation and smart tourism. We believe technology can bridge the gap between ancient history and modern discovery — making cultural heritage accessible, understandable, and preservable for everyone.</p></div>
          <div className="heritage-card p-6">
            <h2 className="font-serif text-xl text-stone-100 mb-3">What We Do</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ icon: Eye, title: 'Document', desc: 'Digital documentation of heritage sites with verified historical data' }, { icon: Globe, title: 'Digitize', desc: '3D models and AR reconstructions of historical structures' }, { icon: BookOpen, title: 'Educate', desc: 'Multilingual storytelling, quizzes and cultural context' }, { icon: Users, title: 'Connect', desc: 'Community platform for cultural knowledge preservation' }, { icon: Shield, title: 'Preserve', desc: 'Knowledge preservation through community contribution and expert verification' }, { icon: Code, title: 'Innovate', desc: 'AI + AR technology for cultural discovery experiences' }].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3"><div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-yellow-500" /></div><div><p className="text-stone-200 text-sm font-semibold">{title}</p><p className="text-stone-500 text-xs leading-relaxed">{desc}</p></div></div>
              ))}
            </div>
          </div>
          <div className="heritage-card p-6">
            <h2 className="font-serif text-xl text-stone-100 mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS v4', 'Framer Motion', 'Three.js', 'Supabase', 'Leaflet', 'Recharts', 'Zustand', 'WebXR (planned)', 'Web Speech API'].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full bg-stone-900 border border-stone-700 text-stone-300 text-xs">{tech}</span>
              ))}
            </div>
          </div>
          <div className="heritage-card p-6"><h2 className="font-serif text-xl text-stone-100 mb-3">Demo Notice</h2><p className="text-stone-400 text-sm leading-relaxed mb-3">This is a prototype built for hackathon/SIH evaluation. Heritage data is based on publicly available historical records. Where data is interpretive or reconstructed, it is clearly labeled with confidence levels.</p><p className="text-stone-500 text-xs">AI recognition uses Demo Mode with predefined mappings. AR uses Three.js 3D viewer with WebXR fallback architecture.</p></div>
          <div className="text-center"><Link to="/explore"><Button variant="gold" size="lg">Start Exploring</Button></Link></div>
        </div>
      </motion.div>
    </div>
  );
}
