import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Building2, Users, FileText, Check, X, Clock, CheckCircle, Edit, Trash2, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { DEMO_CONTRIBUTIONS } from '../data/demo/contributions';
import toast from 'react-hot-toast';
import type { ContributionStatus, Contribution } from '../types';

const SECTIONS = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, { id: 'sites', label: 'Heritage Sites', icon: Building2 }, { id: 'contributions', label: 'Contributions', icon: FileText }, { id: 'users', label: 'Users', icon: Users }];
const CHART_DATA = [{ month: 'Mar', visits: 1200, ar: 340, quizzes: 280 }, { month: 'Apr', visits: 1800, ar: 520, quizzes: 390 }, { month: 'May', visits: 2400, ar: 780, quizzes: 510 }, { month: 'Jun', visits: 3100, ar: 1020, quizzes: 720 }, { month: 'Jul', visits: 2900, ar: 960, quizzes: 680 }, { month: 'Aug', visits: 3800, ar: 1340, quizzes: 890 }, { month: 'Sep', visits: 4200, ar: 1560, quizzes: 1020 }];
const SITE_DATA = DEMO_SITES.map((s, i) => ({ name: s.name_en.split(' ').slice(0, 2).join(' '), visits: [4200, 3100, 2800, 2400, 1900][i] || 1000, ar: [1560, 980, 0, 1200, 0][i] || 0 }));

export default function Admin() {
  const [section, setSection] = useState('dashboard');
  const [contribs, setContribs] = useState<Contribution[]>(DEMO_CONTRIBUTIONS as Contribution[]);

  const updateStatus = (id: string, status: ContributionStatus) => {
    setContribs((p) => p.map((c) => c.id === id ? { ...c, status, review_notes: status === 'approved' ? 'Reviewed and approved by admin.' : 'Does not meet content standards.' } : c));
    toast.success(`Contribution ${status === 'approved' ? 'approved ✓' : 'rejected'}!`);
  };

  const stats = { sites: DEMO_SITES.length, pending: contribs.filter((c) => c.status === 'pending').length, users: 847, ar: 1560 };

  return (
    <div className="min-h-screen pt-16 pb-24 flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col w-56 border-r border-stone-800 px-3 py-6 space-y-1 flex-shrink-0">
        <div className="px-3 mb-6"><p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase">Admin Panel</p><p className="text-stone-500 text-xs mt-1">HeritageLens</p></div>
        {SECTIONS.map((s) => { const Icon = s.icon; return (<button key={s.id} onClick={() => setSection(s.id)} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${section === s.id ? 'bg-yellow-500/15 text-yellow-400' : 'text-stone-500 hover:text-stone-200 hover:bg-white/5'}`}><Icon className="h-4 w-4" />{s.label}</button>); })}
        <div className="mt-4 mx-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><p className="text-amber-400 text-xs">Demo admin. Connect Supabase for full functionality.</p></div>
      </div>
      {/* Mobile tabs */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-stone-950/90 backdrop-blur-xl border-b border-stone-800">
        <div className="flex overflow-x-auto px-4 py-2 gap-2">
          {SECTIONS.map((s) => { const Icon = s.icon; return (<button key={s.id} onClick={() => setSection(s.id)} className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${section === s.id ? 'bg-yellow-500/15 text-yellow-400' : 'text-stone-500'}`}><Icon className="h-3.5 w-3.5" />{s.label}</button>); })}
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-6 mt-12 lg:mt-0 overflow-y-auto">
        {section === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6"><h1 className="font-serif text-2xl text-stone-100">Dashboard</h1><p className="text-stone-500 text-sm">Heritage management overview</p></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[{ label: 'Heritage Sites', value: stats.sites, icon: Building2, color: 'text-yellow-400', bg: 'bg-yellow-500/10' }, { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' }, { label: 'Active Users', value: stats.users.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' }, { label: 'AR Sessions', value: stats.ar.toLocaleString(), icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10' }].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="heritage-card p-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}><Icon className={`h-5 w-5 ${color}`} /></div>
                  <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
                  <div className="text-stone-500 text-xs">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="heritage-card p-5"><h3 className="font-serif text-stone-200 text-base mb-4">Monthly Engagement</h3>
                <ResponsiveContainer width="100%" height={220}><LineChart data={CHART_DATA}><CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" /><XAxis dataKey="month" stroke="#57534e" fontSize={12} /><YAxis stroke="#57534e" fontSize={12} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#f5f5f4' }} /><Line type="monotone" dataKey="visits" stroke="#f59e0b" strokeWidth={2} dot={false} name="Visits" /><Line type="monotone" dataKey="ar" stroke="#8b5cf6" strokeWidth={2} dot={false} name="AR Sessions" /><Line type="monotone" dataKey="quizzes" stroke="#3b82f6" strokeWidth={2} dot={false} name="Quizzes" /></LineChart></ResponsiveContainer>
              </div>
              <div className="heritage-card p-5"><h3 className="font-serif text-stone-200 text-base mb-4">Site Popularity</h3>
                <ResponsiveContainer width="100%" height={220}><BarChart data={SITE_DATA}><CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" /><XAxis dataKey="name" stroke="#57534e" fontSize={10} /><YAxis stroke="#57534e" fontSize={12} /><Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', fontSize: '12px' }} /><Bar dataKey="visits" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Visits" /><Bar dataKey="ar" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="AR" /></BarChart></ResponsiveContainer>
              </div>
            </div>
            <div className="heritage-card p-5">
              <div className="flex items-center justify-between mb-4"><h3 className="font-serif text-stone-200 text-base">Pending Contributions</h3><button onClick={() => setSection('contributions')} className="text-yellow-500 text-xs hover:text-yellow-400">View All →</button></div>
              <div className="space-y-3">
                {contribs.filter((c) => c.status === 'pending').slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-900/60">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0"><FileText className="h-4 w-4 text-amber-400" /></div>
                    <div className="flex-1 min-w-0"><p className="text-stone-200 text-xs font-semibold truncate">{c.title}</p><p className="text-stone-600 text-xs capitalize">{c.type} · {c.contributor_name}</p></div>
                    <div className="flex gap-1">
                      <button onClick={() => updateStatus(c.id, 'approved')} className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" aria-label="Approve"><Check className="h-3.5 w-3.5" /></button>
                      <button onClick={() => updateStatus(c.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25" aria-label="Reject"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
                {contribs.filter((c) => c.status === 'pending').length === 0 && <p className="text-stone-600 text-sm text-center py-4">No pending contributions.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {section === 'sites' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6"><div><h1 className="font-serif text-2xl text-stone-100">Heritage Sites</h1><p className="text-stone-500 text-sm">{DEMO_SITES.length} sites in database</p></div><Button variant="gold" size="sm" icon={<Building2 className="h-4 w-4" />}>Add Site</Button></div>
            <div className="space-y-3">
              {DEMO_SITES.map((site) => (
                <div key={site.id} className="heritage-card p-4 flex gap-4">
                  <img src={site.featured_image} alt={site.name_en} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590169786462-7d54566b25b1?w=100&q=80'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1"><h3 className="text-stone-200 font-semibold text-sm">{site.name_en}</h3><div className="flex gap-1 flex-shrink-0">{site.is_unesco && <Badge variant="unesco">UNESCO</Badge>}{site.ar_available && <Badge variant="ar">AR</Badge>}</div></div>
                    <p className="text-stone-500 text-xs mb-1">{site.location_name} · {site.dynasty}</p>
                    <Badge variant={site.verification_status === 'verified' ? 'green' : 'stone'}>{site.verification_status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 rounded-lg text-stone-500 hover:text-stone-300 hover:bg-white/5" aria-label="Edit"><Edit className="h-3.5 w-3.5" /></button>
                    <button className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {section === 'contributions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6"><h1 className="font-serif text-2xl text-stone-100">Contributions</h1><p className="text-stone-500 text-sm">Review and moderate community submissions</p></div>
            <div className="space-y-4">
              {contribs.map((c, i) => {
                const site = DEMO_SITES.find((s) => s.id === c.heritage_site_id);
                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="heritage-card p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div><h3 className="text-stone-100 font-semibold text-sm mb-0.5">{c.title}</h3><div className="flex items-center gap-2 text-xs text-stone-500"><span className="capitalize">{c.type.replace('_', ' ')}</span><span>·</span>{site && <span>{site.name_en}</span>}<span>·</span><span>{c.contributor_name}</span></div></div>
                      <div className="flex items-center gap-2">
                        {c.status === 'pending' && <Badge variant="stone">Pending</Badge>}
                        {c.status === 'under_verification' && <Badge variant="gold">Verifying</Badge>}
                        {c.status === 'approved' && <Badge variant="green"><CheckCircle className="h-2.5 w-2.5" />Approved</Badge>}
                        {c.status === 'rejected' && <Badge variant="red"><X className="h-2.5 w-2.5" />Rejected</Badge>}
                      </div>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed mb-3">{c.description}</p>
                    {c.source_reference && <p className="text-stone-600 text-xs mb-3">📚 {c.source_reference}</p>}
                    {c.review_notes && <div className="mb-3 p-2.5 rounded-lg bg-stone-900 border border-stone-800"><p className="text-stone-400 text-xs"><strong>Review Note:</strong> {c.review_notes}</p></div>}
                    {(c.status === 'pending' || c.status === 'under_verification') && (
                      <div className="flex gap-2">
                        <Button variant="success" size="sm" icon={<Check className="h-3.5 w-3.5" />} onClick={() => updateStatus(c.id, 'approved')}>Verify & Approve</Button>
                        <Button variant="danger" size="sm" icon={<X className="h-3.5 w-3.5" />} onClick={() => updateStatus(c.id, 'rejected')}>Reject</Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {section === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-serif text-2xl text-stone-100 mb-6">Users</h1>
            <div className="heritage-card p-8 text-center"><Users className="h-12 w-12 text-stone-600 mx-auto mb-3" /><p className="text-stone-400 text-sm mb-2">User management requires Supabase connection.</p><p className="text-stone-600 text-xs">Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable full user management.</p></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
