import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronRight, TrendingUp, Map as MapIcon, 
  Briefcase, Newspaper, Building2, Search, 
  ArrowUpRight, BarChart3, Droplets, Drill,
  Globe, Mail, Phone, Facebook, Twitter, Linkedin,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { fetchLiveMarketStats, type MarketStat as MarketStatType } from './services/marketService';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const MARKET_STATS: MarketStatType[] = [
  { label: 'WTI Crude', value: '$78.42', change: 1.2, unit: 'bbl' },
  { label: 'Rig Count (ND)', value: '42', change: -2, unit: 'active' },
  { label: 'Daily Production', value: '1.24M', change: 0.5, unit: 'bpd' },
  { label: 'Gas Price', value: '$2.15', change: -0.8, unit: 'mcf' },
];

const NEWS_ITEMS = [
  {
    id: '1',
    title: 'New Pipeline Expansion Approved for Williston Basin',
    excerpt: 'The NDIC has approved a 200-mile expansion that will significantly increase takeaway capacity...',
    category: 'Midstream',
    date: 'Mar 1, 2026',
    imageUrl: 'https://picsum.photos/seed/pipeline/800/600',
  },
  {
    id: '2',
    title: 'Continental Resources Announces Q4 Record Production',
    excerpt: 'Continental reported a 15% year-over-year increase in Bakken production, citing improved completion techniques...',
    category: 'Drilling',
    date: 'Feb 28, 2026',
    imageUrl: 'https://picsum.photos/seed/rig/800/600',
  },
  {
    id: '3',
    title: 'Bakken Job Market Hits 5-Year High in Q1',
    excerpt: 'Operator demand for skilled technicians and engineers has driven wages up by 8% across the basin...',
    category: 'Jobs',
    date: 'Feb 25, 2026',
    imageUrl: 'https://picsum.photos/seed/workers/800/600',
  },
];

const JOBS = [
  { id: '1', title: 'Senior Completion Engineer', company: 'Hess Corporation', location: 'Tioga, ND', type: 'Operator', postedAt: '2h ago' },
  { id: '2', title: 'Field Service Technician', company: 'Halliburton', location: 'Williston, ND', type: 'Services', postedAt: '5h ago' },
  { id: '3', title: 'Pipeline Integrity Manager', company: 'ONEOK', location: 'Sidney, MT', type: 'Midstream', postedAt: '1d ago' },
  { id: '4', title: 'Lease Operator', company: 'Continental Resources', location: 'Watford City, ND', type: 'Operator', postedAt: '2d ago' },
];

const CHART_DATA = [
  { name: 'Jan', value: 1150 },
  { name: 'Feb', value: 1180 },
  { name: 'Mar', value: 1210 },
  { name: 'Apr', value: 1190 },
  { name: 'May', value: 1240 },
  { name: 'Jun', value: 1280 },
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'News', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Maps', href: '#' },
    { name: 'Companies', href: '#' },
    { name: 'Counties', href: '#' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-bakken-dark rounded-lg flex items-center justify-center">
            <Droplets className="text-bakken-accent w-6 h-6" />
          </div>
          <span className={cn(
            "text-xl font-bold tracking-tight",
            scrolled ? "text-bakken-dark" : "text-bakken-dark"
          )}>
            BAKKEN<span className="text-bakken-accent">SHALE</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-bakken-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-bakken-dark text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all">
            Subscribe
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t border-slate-100 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-lg font-medium text-slate-900">
                  {link.name}
                </a>
              ))}
              <button className="w-full bg-bakken-dark text-white py-3 rounded-xl font-medium mt-4">
                Subscribe
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatCard = ({ stat }: { stat: MarketStatType, key?: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{stat.label}</span>
      <span className={cn(
        "text-xs font-bold px-2 py-0.5 rounded-full",
        stat.change > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {stat.change > 0 ? '+' : ''}{stat.change}%
      </span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
      <span className="text-xs text-slate-400 font-medium">{stat.unit}</span>
    </div>
  </div>
);

const NewsCard = ({ item }: { item: typeof NEWS_ITEMS[0], key?: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={item.imageUrl} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-bakken-dark/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>
    </div>
    <div className="p-6">
      <span className="text-xs text-slate-400 font-medium mb-2 block">{item.date}</span>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-bakken-accent transition-colors leading-tight">
        {item.title}
      </h3>
      <p className="text-slate-500 text-sm line-clamp-2 mb-4">
        {item.excerpt}
      </p>
      <div className="flex items-center text-bakken-accent font-bold text-sm">
        Read More <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  </motion.div>
);

const JobRow = ({ job }: { job: typeof JOBS[0], key?: string }) => (
  <div className="data-grid-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
        <Building2 className="text-slate-400 w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{job.title}</h4>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{job.company}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>{job.location}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-6">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
        {job.type}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-xs text-slate-400 font-medium">{job.postedAt}</span>
        <button className="p-2 hover:bg-bakken-accent/10 hover:text-bakken-accent rounded-full transition-colors">
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [marketStats, setMarketStats] = useState<MarketStatType[]>(MARKET_STATS);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      setLoadingStats(true);
      const stats = await fetchLiveMarketStats();
      if (stats && stats.length > 0) {
        setMarketStats(stats);
      }
      setLoadingStats(false);
    };
    getStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-bakken-accent selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Bakken Production Up 4.2% YoY</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-bakken-dark leading-[1.1] mb-8">
                The Pulse of the <br />
                <span className="text-bakken-accent italic">Bakken Shale.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl mb-10 leading-relaxed">
                Comprehensive news, real-time data, and career opportunities in the Williston Basin. Stay ahead of the curve in America's premier oil play.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-bakken-dark text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                  Explore Maps <MapIcon className="w-5 h-5" />
                </button>
                <button className="bg-white text-bakken-dark border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                  Latest Jobs <Briefcase className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Production Trend</h3>
                  <p className="text-sm text-slate-400">Williston Basin (MBPD)</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-bakken-accent rounded-full" />
                  <div className="w-3 h-3 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {MARKET_STATS.slice(0, 2).map(stat => (
                  <div key={stat.label} className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Market Data</h3>
            {loadingStats && (
              <div className="flex items-center gap-2 text-bakken-accent text-xs font-bold">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Updating...
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-serif font-bold text-bakken-dark mb-4">Latest Industry News</h2>
              <p className="text-slate-500 max-w-lg">The most critical updates from across the Bakken Shale, curated by industry experts.</p>
            </div>
            <button className="text-bakken-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All News <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {NEWS_ITEMS.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-bakken-dark rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-bakken-accent/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-4xl font-serif font-bold mb-4">Career Opportunities</h2>
                  <p className="text-slate-400 max-w-md">Find your next role with the top operators and service companies in the basin.</p>
                </div>
                <button className="bg-bakken-accent text-bakken-dark px-8 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all">
                  Post a Job Listing
                </button>
              </div>
              
              <div className="bg-white rounded-3xl p-4 md:p-8 text-slate-900">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Search jobs (e.g. Engineer, Williston)..." 
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-bakken-accent outline-none"
                    />
                  </div>
                  <button className="hidden sm:block bg-slate-900 text-white px-6 py-3 rounded-xl font-bold">
                    Filter
                  </button>
                </div>
                <div className="space-y-2">
                  {JOBS.map((job) => (
                    <JobRow key={job.id} job={job} />
                  ))}
                </div>
                <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-bakken-accent hover:text-bakken-accent transition-all">
                  Load More Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geology Section */}
      <section className="py-24 bg-slate-900 text-white px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
                <BarChart3 className="w-4 h-4" />
                <span>Geological Insights</span>
              </div>
              <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">
                Unlocking the <br />
                <span className="text-bakken-accent italic">Williston Basin.</span>
              </h2>
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p>
                  The Bakken Shale is a complex rock formation deposited in the late Devonian age. Consisting of three distinct layers, it serves as both a source rock and a seal for the underlying Three Forks formation.
                </p>
                <p>
                  Modern horizontal drilling and hydraulic fracturing have transformed this once-unreachable resource into one of the world's most productive oil plays.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-white mb-1">400B+</p>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Barrels in Place</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white mb-1">40B</p>
                  <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Recoverable Est.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700">
                  <h4 className="font-bold text-bakken-accent mb-2">Upper Shale</h4>
                  <p className="text-xs text-slate-400">High organic content, primary source rock for the formation.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700">
                  <h4 className="font-bold text-bakken-accent mb-2">Middle Member</h4>
                  <p className="text-xs text-slate-400">Dolomitic siltstone and sandstone, the primary target for drilling.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700">
                  <h4 className="font-bold text-bakken-accent mb-2">Lower Shale</h4>
                  <p className="text-xs text-slate-400">Secondary source rock and critical seal for the Three Forks.</p>
                </div>
                <div className="bg-bakken-accent p-6 rounded-[2rem] text-bakken-dark">
                  <h4 className="font-bold mb-2">Three Forks</h4>
                  <p className="text-xs font-medium">The underlying formation offering additional multi-bench potential.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-bakken-dark mb-4">Leading Operators</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">The companies driving innovation and production across the Bakken Shale Play.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              'Continental Resources', 'Hess Corporation', 'EOG Resources', 
              'Marathon Oil', 'Chord Energy', 'Chevron'
            ].map((company) => (
              <div key={company} className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-bakken-accent/10 transition-colors">
                  <Building2 className="text-slate-300 group-hover:text-bakken-accent w-10 h-10 transition-colors" />
                </div>
                <span className="text-sm font-bold text-slate-600 group-hover:text-bakken-dark transition-colors">{company}</span>
              </div>
            ))}
          </div>
          <div className="mt-16 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Globe className="text-bakken-accent w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Carbon Capture & Storage</h4>
                <p className="text-slate-500">Explore the future of sustainable energy in the basin.</p>
              </div>
            </div>
            <button className="bg-bakken-dark text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              Visit CCUS.com
            </button>
          </div>
        </div>
      </section>
      {/* Map Teaser */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src="https://picsum.photos/seed/map/1200/800" 
                  alt="Bakken Shale Map" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-bakken-dark/20 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl text-center shadow-xl">
                    <MapIcon className="w-12 h-12 text-bakken-accent mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-bakken-dark mb-2">Interactive Basin Map</h4>
                    <p className="text-sm text-slate-500 mb-4">View active rigs, pipelines, and lease boundaries.</p>
                    <button className="bg-bakken-dark text-white px-6 py-2 rounded-xl text-sm font-bold">Launch Viewer</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-serif font-bold text-bakken-dark mb-6 leading-tight">
                Precision Data for <br />
                <span className="text-bakken-accent italic">Strategic Decisions.</span>
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                Our proprietary mapping engine combines geological data with real-time operational insights. Track the evolution of the play from discovery to maturity.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Real-time Rig Tracking',
                  'Pipeline & Midstream Infrastructure',
                  'County-level Production Data',
                  'Geological Formation Layers'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-bakken-accent rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="text-bakken-dark font-bold flex items-center gap-2 group">
                Learn about Bakken Geology <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bakken-dark text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-bakken-accent rounded flex items-center justify-center">
                  <Droplets className="text-bakken-dark w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  BAKKEN<span className="text-bakken-accent">SHALE</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                The leading source for news, data, and jobs in the Bakken Shale since 2009. Part of the KED Interests network.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-bakken-accent hover:text-bakken-dark transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-bakken-accent hover:text-bakken-dark transition-all"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-bakken-accent hover:text-bakken-dark transition-all"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-lg">Resources</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Bakken News</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Drilling Reports</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Geology Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Company Directory</a></li>
                <li><a href="#" className="hover:text-white transition-colors">County Courthouses</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-lg">Company</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-lg">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-6">Get the weekly Bakken Briefing delivered to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm flex-1 focus:ring-2 focus:ring-bakken-accent outline-none"
                />
                <button className="bg-bakken-accent text-bakken-dark p-3 rounded-xl font-bold">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs">
            <p>© 2026 KED INTERESTS, LLC. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
