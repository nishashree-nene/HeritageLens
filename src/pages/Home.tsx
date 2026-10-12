import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Compass, Cpu, BookOpen, Users, ArrowRight, Camera, Clock, CheckCircle, Star, Shield, Globe, MapPin, Play, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { HeritageCard } from '../components/heritage/HeritageCard';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Badge } from '../components/ui/Badge';
import { DEMO_SITES } from '../data/demo/heritage-sites';
import { useAppStore } from '../store/appStore';

function Hero() {
  const { language } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1920px-Brihadeeswarar_temple_in_Thanjavur.jpg" alt="Brihadeeswarar Temple" className="w-full h-full object-cover opacity-25" />
      </motion.div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 glass-gold rounded-full px-4 py-1.5">
              <Cpu className="h-3.5 w-3.5 text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-400 tracking-wider uppercase">AI + AR Cultural Heritage Platform</span>
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="font-serif text-5xl md:text-7xl text-stone-100 leading-[1.1] mb-6">
            See the Past.<br /><span className="text-gradient-gold">Through Your Lens.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-stone-400 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            Discover, experience and preserve cultural heritage with AI, augmented reality and immersive storytelling.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap gap-3 mb-12">
            <Link to="/explore"><Button variant="gold" size="lg" icon={<Compass className="h-4 w-4" />}>{language === 'ta' ? 'பாரம்பரியத்தை ஆராயுங்கள்' : 'Explore Heritage'}</Button></Link>
            <Link to="/ar"><Button variant="ghost" size="lg" icon={<Cpu className="h-4 w-4" />}>{language === 'ta' ? 'AR அனுபவம்' : 'Experience AR'}</Button></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-6">
            {[{ value: '5+', label: 'Heritage Sites', icon: MapPin }, { value: '1000+', label: 'Years of History', icon: Clock }, { value: '3', label: 'AR Experiences', icon: Cpu }, { value: '100%', label: 'Verified Content', icon: CheckCircle }].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-yellow-600" />
                <div><div className="text-yellow-400 font-bold text-lg leading-none">{value}</div><div className="text-stone-600 text-xs">{label}</div></div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      {/* Floating card */}
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="glass-gold rounded-2xl p-4 w-72">
          <div className="relative rounded-xl overflow-hidden mb-3 h-36">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/600px-Brihadeeswarar_temple_in_Thanjavur.jpg" alt="Brihadeeswarar Temple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 flex gap-1.5"><Badge variant="ar"><Cpu className="h-2.5 w-2.5" />AR</Badge><Badge variant="3d">3D</Badge></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-start justify-between"><h3 className="font-serif text-stone-100 text-sm font-semibold leading-tight">Brihadeeswarar Temple</h3><Badge variant="unesco" className="shrink-0 ml-2">UNESCO</Badge></div>
            <div className="flex items-center gap-1 text-stone-400 text-xs"><MapPin className="h-3 w-3 text-yellow-600" /><span>Thanjavur, Tamil Nadu</span></div>
            <div className="flex items-center gap-1 text-stone-500 text-xs"><Clock className="h-3 w-3" /><span>Chola Period · 1010 CE</span></div>
            <div className="text-xs text-emerald-400 font-semibold">● Excellent · Expert Verified</div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/8">
            <Link to="/heritage/brihadeeswarar-temple" className="flex items-center justify-between text-xs text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"><span>Explore Site</span><ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-600" aria-hidden="true"><ChevronDown className="h-6 w-6" /></motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Camera, title: 'Discover', desc: 'Explore heritage sites or scan with your camera', color: 'from-yellow-500 to-yellow-700' },
    { icon: Eye, title: 'Identify', desc: 'AI recognizes the site from historical records', color: 'from-purple-500 to-purple-700' },
    { icon: Clock, title: 'See the Past', desc: 'Experience cinematic historical reconstructions', color: 'from-blue-500 to-blue-700' },
    { icon: Cpu, title: 'Explore in AR', desc: 'Walk through 3D reconstructions in AR', color: 'from-emerald-500 to-emerald-700' },
    { icon: BookOpen, title: 'Learn', desc: 'Multilingual storytelling, quizzes and context', color: 'from-orange-500 to-orange-700' },
    { icon: Users, title: 'Preserve', desc: 'Contribute stories and document living heritage', color: 'from-rose-500 to-rose-700' },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionTitle subtitle="The Journey" title="How HeritageLens Works" description="From discovery to preservation — a complete cultural heritage experience" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-lg relative`}>
                <Icon className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center"><span className="text-[10px] text-stone-400 font-bold">{i + 1}</span></div>
              </div>
              <h3 className="text-stone-200 font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-stone-600 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedSites() {
  const { language } = useAppStore();
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <SectionTitle align="left" subtitle="Featured Heritage" title={language === 'ta' ? 'பாரம்பரியத்தை ஆராயுங்கள்' : 'Explore Heritage'} description="Discover magnificent cultural sites across Tamil Nadu" className="mb-0" />
        <Link to="/explore" className="hidden sm:flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">View All <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMO_SITES.slice(0, 3).map((site, i) => <HeritageCard key={site.id} site={site} index={i} />)}
      </div>
      <div className="text-center mt-8">
        <Link to="/explore"><Button variant="ghost" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>{language === 'ta' ? 'அனைத்தையும் காண்க' : 'See All Heritage Sites'}</Button></Link>
      </div>
    </section>
  );
}

function SeeThePastPromo() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Brihadeeswarar_temple_in_Thanjavur.jpg/1280px-Brihadeeswarar_temple_in_Thanjavur.jpg" alt="See the Past" className="w-full h-[500px] object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8 md:px-16 max-w-2xl">
              <p className="text-yellow-500 text-xs font-bold tracking-[0.25em] uppercase mb-3">Signature Feature</p>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-100 mb-5 leading-tight">Travel Back<br /><span className="text-gradient-gold">1,000 Years</span></h2>
              <p className="text-stone-400 text-base leading-relaxed mb-6">The "SEE THE PAST" experience transports you through time with cinematic transitions, historical reconstructions and immersive storytelling. See temples as they looked when first consecrated.</p>
              <div className="mb-6 p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-500 inline-block">⚠️ Reconstructions labeled with confidence levels. Not presented as confirmed historical fact.</div>
              <div className="flex gap-3">
                <Link to="/see-the-past/brihadeeswarar-temple"><Button variant="gold" size="lg" icon={<Play className="h-4 w-4" />}>See the Past</Button></Link>
                <Link to="/ar"><Button variant="ghost" size="lg" icon={<Cpu className="h-4 w-4" />}>AR Experience</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const features = [
    { icon: Camera, title: 'AI Site Recognition', description: 'Point your camera at any heritage site. AI identifies the structure and provides historical context.', badge: 'AI Powered', link: '/scan' },
    { icon: Cpu, title: 'AR & 3D Experience', description: 'Explore 3D models and AR overlays. Walk through ancient structures reconstructed from evidence.', badge: 'AR/3D', link: '/ar' },
    { icon: Globe, title: 'Tamil & English', description: 'Full multilingual support with Tamil and English content, stories, and audio narration.', badge: 'Multilingual', link: '/explore' },
    { icon: Star, title: 'Quizzes & Badges', description: 'Test your knowledge, earn heritage badges and track your cultural exploration journey.', badge: 'Learn', link: '/learn' },
    { icon: Users, title: 'Community', description: 'Share stories, photographs, and local knowledge. Help preserve cultural memory.', badge: 'Community', link: '/community' },
    { icon: Shield, title: 'Verified Content', description: 'All content verified by heritage experts. Sources cited. Reconstructions labeled with confidence.', badge: 'Verified', link: '/explore' },
  ];
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <SectionTitle subtitle="Platform Features" title="Everything Heritage" description="A complete platform for discovery, learning, preservation and community" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link to={f.link} className="block heritage-card p-6 h-full group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center"><Icon className="h-5 w-5 text-yellow-500" /></div>
                  <Badge variant="gold">{f.badge}</Badge>
                </div>
                <h3 className="font-serif text-stone-100 text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-1 text-yellow-500 text-xs font-semibold group-hover:gap-2 transition-all">Learn more <ArrowRight className="h-3 w-3" /></div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function PreservationSection() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-yellow-500 text-xs font-bold tracking-[0.25em] uppercase mb-3">Our Mission</p>
          <h2 className="font-serif text-4xl text-stone-100 mb-5 leading-tight">Preserve & <span className="text-gradient-gold">Contribute</span></h2>
          <p className="text-stone-400 text-base leading-relaxed mb-6">HeritageLens believes heritage preservation is not just for institutions. Every visitor, student, and community member can contribute to documenting cultural memory.</p>
          <div className="space-y-4 mb-8">
            {[{ icon: Camera, text: 'Upload photographs and recordings' }, { icon: BookOpen, text: 'Submit historical stories and local traditions' }, { icon: CheckCircle, text: 'All contributions reviewed by heritage experts' }, { icon: Shield, text: 'Verified content becomes part of the permanent record' }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0"><Icon className="h-4 w-4 text-yellow-500" /></div>
                <span className="text-stone-300 text-sm">{text}</span>
              </div>
            ))}
          </div>
          <Link to="/community"><Button variant="gold" size="lg" icon={<Users className="h-4 w-4" />}>Preserve a Story</Button></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'Heritage Sites', value: '5+', sub: 'Tamil Nadu' }, { label: 'Verified Stories', value: '12+', sub: 'Expert reviewed' }, { label: 'AR Experiences', value: '3', sub: 'Interactive' }, { label: 'Years Covered', value: '3000+', sub: 'Of history' }].map(({ label, value, sub }) => (
            <div key={label} className="heritage-card p-5 text-center">
              <div className="text-3xl font-bold text-gradient-gold mb-1">{value}</div>
              <div className="text-stone-200 text-sm font-semibold">{label}</div>
              <div className="text-stone-600 text-xs">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <FeaturedSites />
      <SeeThePastPromo />
      <FeaturesGrid />
      <PreservationSection />
    </div>
  );
}
