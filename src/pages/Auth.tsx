import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/appStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { UserRole } from '../types';

export default function Auth() {
  const { setUser } = useAppStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'visitor' as UserRole });

  const demoLogin = (role: UserRole) => {
    setUser({ id: `demo-${role}`, user_id: `demo-${role}`, name: role === 'admin' ? 'Admin User' : role === 'expert' ? 'Heritage Expert' : 'Heritage Explorer', role, preferred_language: 'en', created_at: new Date().toISOString() });
    toast.success(`Logged in as ${role} (Demo Mode)`);
    navigate(role === 'admin' ? '/admin' : '/profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    if (!isSupabaseConfigured()) { toast.error('Supabase not configured. Use Demo Login below.'); setLoading(false); return; }
    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name, role: form.role } } });
        if (error) throw error;
        toast.success('Account created! Check your email to verify.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (error) throw error;
        toast.success('Welcome back!'); navigate('/profile');
      }
    } catch (err: any) { toast.error(err.message || 'Authentication failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen pt-16 pb-24 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mx-auto mb-4"><Eye className="h-7 w-7 text-black" /></div>
          <h1 className="font-serif text-2xl text-stone-100">{mode === 'login' ? 'Welcome Back' : 'Join HeritageLens'}</h1>
          <p className="text-stone-500 text-sm mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your heritage account'}</p>
        </div>
        <div className="heritage-card p-6">
          <div className="mb-5">
            <p className="text-stone-400 text-xs font-semibold uppercase tracking-wider mb-3 text-center">Demo Quick Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[{ role: 'visitor' as UserRole, label: 'Visitor', icon: User }, { role: 'student' as UserRole, label: 'Student', icon: User }, { role: 'contributor' as UserRole, label: 'Contributor', icon: User }, { role: 'admin' as UserRole, label: 'Admin', icon: Shield }].map(({ role, label, icon: Icon }) => (
                <button key={role} onClick={() => demoLogin(role)} className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-700 text-stone-300 hover:text-stone-100 hover:border-yellow-500/40 hover:bg-yellow-500/5 text-sm transition-all"><Icon className="h-4 w-4 text-stone-500" />{label}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-stone-800" /><span className="text-stone-600 text-xs">or with email</span><div className="flex-1 h-px bg-stone-800" /></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div><label className="block text-stone-400 text-xs font-semibold mb-1.5">Name</label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" /><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" required /></div>
              </div>
            )}
            <div><label className="block text-stone-400 text-xs font-semibold mb-1.5">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" /><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" required /></div>
            </div>
            <div><label className="block text-stone-400 text-xs font-semibold mb-1.5">Password</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-600" /><input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" required minLength={6} /></div>
            </div>
            {!isSupabaseConfigured() && <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><p className="text-amber-400 text-xs">Supabase not configured. Use Demo Login above.</p></div>}
            <Button type="submit" variant="gold" className="w-full" loading={loading} iconRight={<ArrowRight className="h-4 w-4" />}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Button>
          </form>
          <p className="text-center text-stone-500 text-sm mt-4">{mode === 'login' ? "Don't have an account? " : 'Already have one? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">{mode === 'login' ? 'Sign Up' : 'Sign In'}</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
