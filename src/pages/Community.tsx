import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Camera, Mic, FileText, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DEMO_CONTRIBUTIONS } from '../data/demo/contributions';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import toast from 'react-hot-toast';
import type { ContributionStatus } from '../types';

const TYPES = [
  { id: 'story', label: 'Historical Story', icon: BookOpen, desc: 'Share a historical account or legend' },
  { id: 'photograph', label: 'Photograph', icon: Camera, desc: 'Upload heritage photographs' },
  { id: 'audio', label: 'Audio Recording', icon: Mic, desc: 'Record oral histories or songs' },
  { id: 'tradition', label: 'Local Tradition', icon: FileText, desc: 'Document a local tradition' },
];

function StatusBadge({ status }: { status: ContributionStatus }) {
  const v = { pending: { variant: 'stone' as const, icon: Clock, label: 'Pending Review' }, under_verification: { variant: 'gold' as const, icon: Clock, label: 'Under Verification' }, approved: { variant: 'green' as const, icon: CheckCircle, label: 'Approved' }, rejected: { variant: 'red' as const, icon: XCircle, label: 'Rejected' } }[status];
  const Icon = v.icon;
  return <Badge variant={v.variant}><Icon className="h-2.5 w-2.5" />{v.label}</Badge>;
}

export default function Community() {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'story', siteId: 'site-001', description: '', source: '', name: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Please fill in required fields.'); return; }
    setSubmitted(true);
    toast.success('Contribution submitted! Our heritage experts will review it.');
    setTimeout(() => { setSubmitted(false); setFormOpen(false); setForm({ title: '', type: 'story', siteId: 'site-001', description: '', source: '', name: '' }); }, 2500);
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="bg-gradient-to-b from-stone-900 to-transparent py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">Community</p>
          <h1 className="font-serif text-4xl text-stone-100 mb-3">Preserve a Story</h1>
          <p className="text-stone-400 text-base max-w-xl">Share your knowledge, stories and photographs to help preserve cultural heritage for future generations.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-serif text-lg text-stone-100 mb-4">What would you like to contribute?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TYPES.map((ct, i) => {
              const Icon = ct.icon;
              return (
                <motion.button key={ct.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} onClick={() => { setForm((f) => ({ ...f, type: ct.id })); setFormOpen(true); }} className="heritage-card p-4 text-left group hover:border-yellow-500/30">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-3 group-hover:bg-yellow-500/15 transition-colors"><Icon className="h-5 w-5 text-yellow-500" /></div>
                  <p className="text-stone-200 text-sm font-semibold mb-1">{ct.label}</p>
                  <p className="text-stone-500 text-xs">{ct.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {formOpen && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="heritage-card p-6 mb-8" id="contribute">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg text-stone-100">Submit Contribution</h2>
              <Badge variant="gold">{TYPES.find((t) => t.id === form.type)?.label}</Badge>
            </div>
            {submitted ? (
              <div className="text-center py-8"><CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" /><h3 className="font-serif text-stone-100 text-xl mb-2">Submitted!</h3><p className="text-stone-400 text-sm">Our heritage experts will review it before publishing.</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Heritage Site *</label>
                    <select value={form.siteId} onChange={(e) => setForm((f) => ({ ...f, siteId: e.target.value }))} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-yellow-500/50" required>
                      {DEMO_SITES.map((s) => <option key={s.id} value={s.id}>{s.name_en}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Type</label>
                    <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 focus:outline-none focus:border-yellow-500/50">
                      {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Give your contribution a clear title" className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" required maxLength={200} /></div>
                <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Description / Story *</label>
                  <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Share your knowledge, story, or cultural information in detail..." rows={5} className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50 resize-none" required maxLength={5000} />
                  <p className="text-stone-700 text-xs mt-1 text-right">{form.description.length}/5000</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Source / Reference</label><input type="text" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="Family oral tradition, book title..." className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" /></div>
                  <div><label className="block text-stone-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Your Name (Optional)</label><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Will be credited if approved" className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-yellow-500/50" /></div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"><p className="text-amber-600 text-xs">⚠️ Contributions are reviewed before publishing. We never automatically publish unverified content.</p></div>
                <div className="flex gap-3"><Button type="submit" variant="gold" size="lg" className="flex-1" icon={<Plus className="h-4 w-4" />}>Submit Contribution</Button><Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button></div>
              </form>
            )}
          </motion.div>
        )}

        <div>
          <h2 className="font-serif text-lg text-stone-100 mb-4">Recent Contributions</h2>
          <div className="space-y-4">
            {DEMO_CONTRIBUTIONS.map((c, i) => {
              const site = DEMO_SITES.find((s) => s.id === c.heritage_site_id);
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="heritage-card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1"><h3 className="text-stone-100 font-semibold text-sm mb-0.5">{c.title}</h3><div className="flex items-center gap-2 text-xs text-stone-500">{site && <span>🏛️ {site.name_en}</span>}<span>·</span><span className="capitalize">{c.type.replace('_', ' ')}</span>{c.contributor_name && <><span>·</span><span>{c.contributor_name}</span></>}</div></div>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-stone-400 text-sm leading-relaxed line-clamp-3">{c.description}</p>
                  {c.source_reference && <p className="text-stone-600 text-xs mt-2">📚 {c.source_reference}</p>}
                  {c.review_notes && <div className="mt-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15"><p className="text-emerald-400 text-xs"><span className="font-semibold">Review Note:</span> {c.review_notes}</p></div>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
