"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const team = [
  {
    name: "Diego Vargas",
    role: "Chief Business Engineering Operator",
    desc: "The mind behind the 72h framework. Diego built Better Technologies from a conviction: that real innovation doesn't need a million-dollar budget — it needs relentless execution. He leads the vision, the team, and every sprint from day one.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Organic Growth Chief Developer",
    desc: "Charlotte turns bold ideas into market movements. With a sharp eye for positioning and a data-driven approach to growth, she ensures every product we build doesn't just work — it gets noticed, adopted, and remembered.",
    initials: "CG",
    photo: "/charlotte.jpeg",
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Backend & Infrastructure Chief Engineer",
    desc: "Ezequiel is the engine room of every product we ship. He architects scalable, production-ready systems at startup speed — writing clean, fast, reliable code that makes the impossible 72h timelines actually possible.",
    initials: "EA",
    photo: "/team/ezequiel.jpg",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "UX & Frontend Chief Developer",
    desc: "Victor is the one who makes it beautiful and fast. He crafts interfaces that feel inevitable — intuitive, polished, and ready for real users from the very first sprint. He doesn't just build UIs, he builds experiences.",
    initials: "VM",
    photo: "/victor.jpeg",
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Data Science Chief Operator",
    desc: "Yanina speaks the language of data fluently — and translates it into decisions that matter. She extracts signal from noise, builds intelligence layers into every product, and ensures that what we ship isn't just functional — it's smart.",
    initials: "YS",
    photo: "/Yanina.jpeg",
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

// ─── BELAND SCREENSHOTS ─
const belandScreenshots = [
  { 
    src: "/home1.jpeg", 
    alt: "Main Home", 
    title: "Home", 
    text: "Main dashboard where you can track your wallet, accounts, and overall impact." 
  },
  { 
    src: "/registrate.jpeg", 
    alt: "Registration", 
    title: "Join the App", 
    text: "Sign up, explore, participate, and turn your consumption into meaningful action." 
  },
  { 
    src: "/home.jpeg", 
    alt: "Login", 
    title: "Start Exploring", 
    text: "Top up your balance, shop for products, get them delivered, and transform habits into impact." 
  },
  { 
    src: "/mismonedas.jpeg", 
    alt: "Wallet", 
    title: "Recharge & Shop", 
    text: "Seamless transactions designed to generate social and environmental value." 
  },
  { 
    src: "/grupos.jpeg", 
    alt: "Groups", 
    title: "Build or Join Communities", 
    text: "Join existing groups or create your own to organize circular economy events." 
  },
  { 
    src: "/carrito2.jpeg", 
    alt: "Cart", 
    title: "Delivery with Purpose", 
    text: "Every delivery fuels a network built on circular impact and sustainability." 
  },
  { 
    src: "/impacto.jpeg", 
    alt: "Impact", 
    title: "Your Impact", 
    text: "Track recycled kilograms, liters of water saved, and Becoins earned." 
  },
  { 
    src: "/ordenes.jpeg", 
    alt: "Orders", 
    title: "My Orders", 
    text: "View and manage your active or completed purchases." 
  },
];

const belandTags = ["React Native", "Payments", "Delivery", "Circular Economy"];

// ─── ICONS ───────
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path d="M7 9H5v10h2V9zm-1-1.5A1.25 1.25 0 1 0 6 5a1.25 1.25 0 0 0 0 2.5zM19 13.2c0-2.3-1.1-4.2-3.3-4.2a3.2 3.2 0 0 0-2.7 1.4V9H11v10h2v-5.4c0-1.4.7-2.3 1.9-2.3 1.1 0 1.6.8 1.6 2.2V19h2v-5.8z" fill="#fff" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-gradient)"/>
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
  </svg>
);

// ─── AVATAR ──────────
const Avatar = ({ member }: { member: (typeof team)[0] }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-blue-50 flex items-center justify-center">
      {!imgError ? (
        <Image src={member.photo} alt={member.name} fill sizes="64px" className="object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className="text-blue-600 font-black text-lg">{member.initials}</span>
      )}
    </div>
  );
};

// ─── NEWS SECTION ───────
const NewsSection = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => console.log("Video waiting for interaction"));
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      const fetchExternal = async () => {
        const response = await fetch('/api/news');
        if (!response.ok) { const errorBody = await response.json().catch(() => null); throw new Error(errorBody?.error || 'External news fetch failed.'); }
        return response.json();
      };
      const fetchLocal = async () => {
        const response = await fetch('/api/local-news');
        if (!response.ok) { const errorBody = await response.json().catch(() => null); throw new Error(errorBody?.error || 'Local news fetch failed.'); }
        return response.json();
      };
      try {
        const [externalResult, localResult] = await Promise.allSettled([fetchExternal(), fetchLocal()]);
        let externalData: any = null;
        let localData: any = null;
        if (externalResult.status === 'fulfilled') { externalData = externalResult.value; } else { console.error('External news fetch failed:', externalResult.reason); setNewsError('Unable to load external news.'); }
        if (localResult.status === 'fulfilled') { localData = localResult.value; } else { console.warn('Local news fetch failed:', localResult.reason); setNewsError((prev) => prev ? `${prev} Local news feed is unavailable.` : 'Unable to load local news.'); }
        const externalArticles: any[] = Array.isArray(externalData?.articles)
          ? (() => {
              const bbc = externalData.articles.find((a: any) => a.source?.name?.toLowerCase().includes('bbc'));
              const cnn = externalData.articles.find((a: any) => a.source?.name?.toLowerCase().includes('cnn'));
              const reuters = externalData.articles.find((a: any) => a.source?.name?.toLowerCase().includes('reuters'));
              const selected = [bbc, cnn, reuters].filter(Boolean);
              if (selected.length < 3) { const fillers = externalData.articles.filter((a: any) => !selected.includes(a)); return [...selected, ...fillers].slice(0, 3); }
              return selected;
            })()
          : [];
        const localArticles = Array.isArray(localData?.news)
          ? localData.news.map((item: any) => ({ title: item.title, description: item.description, url: item.post_url, urlToImage: item.cover_url, source: { name: item.category || 'Actualidad' }, publishedAt: item.published_at || new Date().toISOString() }))
          : [];
        const combined = [...localArticles, ...externalArticles].slice(0, 3);
        if (combined.length > 0) { setArticles(combined); } else { setNewsError((prev) => prev || 'No news available at the moment.'); }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNewsError(error instanceof Error ? error.message : 'Unable to fetch news feeds.');
      } finally { setLoading(false); }
    };
    fetchNews();
  }, []);

  const goToPrevious = () => setCurrentIndex((p) => (p === 0 ? articles.length - 1 : p - 1));
  const goToNext    = () => setCurrentIndex((p) => (p === articles.length - 1 ? 0 : p + 1));

  if (loading) return <div className="py-20 text-center text-slate-400 uppercase tracking-widest text-[10px] font-bold">Loading Intelligence Feed...</div>;

  if (articles.length === 0) {
    return (
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 uppercase tracking-[0.25em] text-[10px] font-black mb-2">Global Intelligence Feed</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">News currently unavailable.</h3>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">{newsError || 'We could not fetch the latest intelligence right now. Please try again soon.'}</p>
        </div>
      </section>
    );
  }

  const currentArticle = articles[currentIndex];
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="hidden md:block w-48"></div>
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mt-8 inline-flex flex-col items-center"></div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mt-6 mb-4 block italic">Global Intelligence Feed</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">In times of <br /> <span className="text-blue-600 italic underline decoration-slate-200">Change...</span></h2>
          </div>
          <div className="text-center md:text-right md:w-48">
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">Live updates // April 2026</p>
            <div className="flex gap-2 justify-center md:justify-end mt-2 items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-900 uppercase">System Active</span>
            </div>
          </div>
        </div>
        <div className="w-full relative z-20">
          <motion.a key={currentIndex} href={currentArticle.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="group border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-600/30 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col md:flex-row">
            <div className="relative h-64 md:h-80 md:w-1/2 overflow-hidden bg-slate-100">
              {currentArticle.urlToImage ? (
                <img src={currentArticle.urlToImage} alt={currentArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200"><span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">No Preview Available</span></div>
              )}
              <div className="absolute top-4 left-4"><span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{currentArticle.source.name}</span></div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{currentArticle.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">{currentArticle.description || "Click to read the full coverage of this digital transformation update."}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-400">{new Date(currentArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">Read →</span>
              </div>
            </div>
          </motion.a>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={goToPrevious} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label="Previous article"><span className="text-slate-500 font-black">←</span></button>
            <div className="flex gap-2">
              {articles.map((article: any, index: number) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${index === currentIndex ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <button onClick={goToNext} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label="Next article"><span className="text-slate-500 font-black">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CHAT SECTION ───────
const ChatSection = () => {
  const [step, setStep] = useState<number>(1);
  const [selection, setSelection] = useState<string>("");
  const options = ["Industrial Acceleration", "Smart Supply Chain", "Talent Infrastructure", "Market Entry LATAM", "72h Validation"];
  const handleWhatsApp = (option: string) => {
    const phoneNumber = "593995269974";
    const message = encodeURIComponent(`Hi! I'm interested in ${option}. I'd like to talk to the team about a new project.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">WE DELIVER</p>
        <p className="text-dark-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">REAL TIME CERTAINTY (RTC)</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 uppercase tracking-tighter">OUR KITCHEN IS ALWAYS <span className="italic underline decoration-blue-100"> OPEN </span></h2>
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">20th century told us the future would be built somewhere else We think Differently.</p>
        <p className="text-dark-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">See your self - Follow us on Social Media.</p>
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better.technologies?igsh=cjQ1c3F4OWpoYWhq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
        <div className="relative bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 transition-all hover:border-blue-600/30 text-center">
          {step === 1 ? (
            <>
              <p className="text-xl text-slate-600 mb-8 font-light">How can <span className="text-slate-900 font-semibold underline decoration-blue-600 underline-offset-4">the team</span> help you today?</p>
              <div className="flex flex-wrap justify-center gap-3">
                {options.map((opt) => (
                  <button key={opt} onClick={() => { setSelection(opt); setStep(2); }} className="text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border-2 border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 shadow-sm">{opt}</button>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4 text-left">
  {/* Título y Descripción */}
  <div className="mb-6">
    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
      Industrial Acceleration 
    </h3>
    <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">
      (Nearshoring + Smart Maquila)
    </p>
    <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-blue-600 pl-4">
      Relocating global production to LATAM with speed and cost efficiency.
    </p>
  </div>

  {/* Lista de Ventas */}
  <div className="mb-8 space-y-2">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What we sell:</p>
    <ul className="text-sm text-slate-700 space-y-1">
      <li className="flex items-start gap-2"><span>●</span> Operational setup in PY / MX / CO</li>
      <li className="flex items-start gap-2"><span>●</span> Industrial supplier networks</li>
      <li className="flex items-start gap-2 text-blue-600 font-bold"><span>●</span> Cost optimization (30–60%)</li>
      <li className="flex items-start gap-2"><span>●</span> Local operational management</li>
    </ul>
  </div>

  {/* Botones */}
  <button onClick={() => handleWhatsApp(selection)} className="w-full bg-blue-600 text-white py-4 rounded-full font-black text-sm hover:bg-blue-700 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">
    Connect with the team
  </button>
  
  <button onClick={() => setStep(1)} className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors">
    ← Go back
  </button>
</div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── CASOS DE ÉXITO ────────────────
const CasosDeExito = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % belandScreenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + belandScreenshots.length) % belandScreenshots.length);
  };
  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % belandScreenshots.length);
  };
  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove  = (e: React.TouchEvent) => (touchCurrentX.current = e.touches[0].clientX);
  const handleTouchEnd   = () => {
    if (touchStartX.current == null || touchCurrentX.current == null) return;
    const delta = touchStartX.current - touchCurrentX.current;
    if (delta > 50) goToNext(); else if (delta < -50) goToPrevious();
    touchStartX.current = null; touchCurrentX.current = null;
  };

  return (
    <section className="py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">Our Success Stories</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
            Built by us. <em className="italic underline decoration-blue-100">Used by people.</em>
          </h2>
        </div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT — Phone carousel */}
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-[260px] sm:max-w-[300px] cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Phone frame */}
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-[6px] border-slate-900 bg-black shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20" />
                {belandScreenshots.map((screenshot, index) => (
                  <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <Image src={screenshot.src} alt={screenshot.alt} fill className="object-contain" priority={index === 0} sizes="300px" />
                  </div>
                ))}
              </div>

              {/* Nav arrows */}
              <button onClick={goToPrevious} className="absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:border-blue-600 transition-colors z-30">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button onClick={goToNext} className="absolute -right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:border-blue-600 transition-colors z-30">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-1.5 mt-5">
                {belandScreenshots.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 h-1.5 bg-blue-600" : "w-1.5 h-1.5 bg-slate-300"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-6">

{/* Logo Beland  */}
<div className="inline-flex flex-col items-start">
  
  <div style={{ width: '200px', height: '50px' }} className="relative -ml-4">
  <Image 
    src="/beland.titulo.png" 
    alt="Beland Logo" 
    fill
    className="object-contain object-left" 
    priority 
  />
</div>
</div>
            {/* Slide caption */}
            <div key={currentSlide} className="border-l-4 border-blue-600 pl-4 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{belandScreenshots[currentSlide].title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{belandScreenshots[currentSlide].text}</p>
            </div>

            {/* Description */}
            <p className="text-slate-700 text-base leading-relaxed font-medium">
          A <span className="text-slate-900 font-black">circular ecosystem</span> that integrates payments, delivery, and rewards within a single system, driving a network where every <span className="text-blue-600 font-bold">positive action</span> strengthens the entire community.
        </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {belandTags.map((tag) => (
                <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50">{tag}</span>
              ))}
            </div>

            {/* CTA */}
            <a href="https://beland.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
              View the app <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN HOME ──────────────────
export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false }).limit(3);
      if (data) setPosts(data);
    };
    fetchPosts();
  }, []);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    video.muted = true; video.playsInline = true;
    const tryPlay = () => { video.play().catch(() => {}); };
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    tryPlay();
    video.addEventListener("touchstart", tryPlay, { once: true });
    return () => { video.removeEventListener("loadedmetadata", tryPlay); video.removeEventListener("loadeddata", tryPlay); video.removeEventListener("canplay", tryPlay); };
  }, []);

  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : "unset"; }, [isOpen]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Home",         href: "#top" },
    { name: "What we are",  href: "#what-we-are" },
    { name: "Mittelstand",  href: "#mittelstand" },
    { name: "Pricing",      href: "#pricing" },
    { name: "About",        href: "#about" },
    { name: "Blog",         href: "/blog" },
  ];

  return (
    <main className="relative w-full bg-white">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-24 py-5 z-[100] backdrop-blur-md bg-black border-b border-white/10">
        <div className="relative w-[120px] md:w-[140px] h-[40px] flex items-center justify-start">
          <Image src="/logo.png" alt="Logo" fill sizes="(max-width: 768px) 120px, 140px" className="object-contain" />
        </div>
        <nav className="hidden md:flex gap-8 text-white font-black uppercase text-xs tracking-widest">
          {menuItems.map((item) => (<a key={item.name} href={item.href} className="hover:text-blue-600 transition-colors">{item.name}</a>))}
        </nav>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="md:hidden relative z-[110] flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none" aria-label="Menu">
          <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-7 h-[2px] bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-0 left-0 right-0 bottom-0 bg-black flex flex-col items-center justify-center gap-8 z-[105] md:hidden">
            {menuItems.map((item) => (<a key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="text-white text-4xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">{item.name}</a>))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO */}
      <section className="relative w-full h-[100dvh] overflow-hidden" id="top">
        <video ref={heroVideoRef} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover" autoPlay loop muted playsInline preload="auto">
          <source 
  src={`https://res.cloudinary.com/djp2qzp9f/video/upload/q_auto,vc_h264/${isMobile ? "c_fill,ar_9:16" : "c_fill,ar_16:9"}/v1775676329/IMG_2919_l50wan.mp4`} 
  type="video/mp4" 
/>
        </video>
        <div className="absolute inset-0 bg-white/10 z-[1]" />
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-blue-600 uppercase tracking-[0.4em] mb-3 text-[10px] font-black">What we are?</p>
          <h1 className="text-3xl md:text-8xl font-black leading-[1] tracking-tighter max-w-4xl text-white uppercase">We operate LATAM for <br /> Global companies</h1>
          <p className="mt-3 text-white text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Nearshoring Operator · Supply Chain Partner · Talent Hub · Entry &amp; Ops Partner</p>
          
          <a href="https://wa.me/593995269974?text=Hi!%20I%27d%20like%20to%20get%20in%20touch%20with%20the%20team." className="mt-3 inline-block px-8 py-3 bg-[#FF6B00] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-[10px] transition-transform active:scale-95">Get in touch</a>
        </div>
      </section>

      {/* 2. NEWS FEED */}
      <NewsSection />

      {/* 3. CHAT */}
      <ChatSection />

      {/* 4. MITTELSTAND */}
      <section id="mittelstand" className="py-40 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-slate-900">The Problem we solve</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">Long supply chains (Asia / Middle East) are falling due to conflict. Latin America is the obvious alternative — but remains impossible to execute.</p>
            <div className="space-y-4 mb-8">
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">BCG Digital Ventures</p>
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">McKinsey &amp; Company</p>
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">Accenture</p>
            </div>
            <div className="pt-6 border-t border-slate-100"><p className="text-sm font-bold italic text-slate-900 tracking-tight">Typical tickets: <span className="text-blue-600">€150k - €1M+</span></p></div>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 leading-[1.1] tracking-tighter">Our Customer: <br /><span className="text-blue-600">Medium Sized<br />Global Companies</span></h2>
            <ul className="space-y-6 text-xl text-slate-600 font-medium mb-10">
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />50–500 employees</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />Ops in different countries / regions</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />Long Supply Chain dependent</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />Traditional business</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="pt-10 pb-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-20 text-slate-900 uppercase tracking-tighter">What you <span className="text-blue-600">can</span> afford</h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50">
              <div className="flex flex-col gap-4 mb-10"><h3 className="text-2xl font-bold text-slate-900 uppercase">72h Validation Challenge</h3><span className="self-start bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€3k – €10k</span></div>
              <ul className="space-y-4 text-slate-600"><li className="font-bold flex items-start gap-2"><span className="text-blue-600 mt-0.5">→</span> Opportunity Validation: Problem + Executable Solution hypothesis</li><li className="font-bold flex items-start gap-2"><span className="text-blue-600 mt-0.5">→</span> Feasibility Study: Financial overview + Operations forecast</li></ul>
            </div>
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50 shadow-xl shadow-slate-100">
              <div className="flex flex-col gap-4 mb-10"><h3 className="text-2xl font-bold text-slate-900 uppercase">MVP Stage — 90 days</h3><span className="self-start bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€30k – €120k</span></div>
              <ul className="space-y-4 text-slate-600"><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Solution engineering</li><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Functional MVP</li><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Beta testing (with real users)</li></ul>
            </div>
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50">
              <div className="flex flex-col gap-4 mb-10"><h3 className="text-2xl font-bold text-slate-900 uppercase">Growth / Scale</h3><span className="self-start bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-black italic">Tailor made</span></div>
              <ul className="space-y-4 text-slate-600"><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Local + Digital operation</li><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Success oriented business execution</li><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Reduced operational costs</li><li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span> Scale faster and better</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EQUIPO */}
      <section id="about" className="pt-12 pb-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">About our Team</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6">High <em className="italic underline decoration-blue-100">Performance execution team</em></h2>
          <div className="border-l-[3px] border-blue-600 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-8">
            <p className="text-slate-900 font-black italic text-sm leading-relaxed tracking-tight">&ldquo;We were told the future would be built somewhere else. <br /><span className="text-blue-600">We chose to prove them wrong.&rdquo;</span></p>
          </div>
          <AnimatePresence mode="wait">
            {selected !== null && (
              <motion.div key={selected} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center gap-5 border border-slate-100 rounded-3xl p-5 mb-6 hover:border-blue-600/30 transition-colors">
                <Avatar member={team[selected]} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-slate-900 font-black uppercase tracking-tight text-sm">{team[selected].name}</p>
                      <p className="text-blue-600 font-black uppercase tracking-[0.15em] text-[10px] mt-0.5 mb-2">{team[selected].role}</p>
                    </div>
                    <a href={team[selected].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-600 hover:bg-blue-50 transition-all flex-shrink-0"><LinkedInIcon /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">LinkedIn</span></a>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{team[selected].desc}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {team.map((member, i) => (
              <button key={i} type="button" onClick={() => setSelected(selected === i ? null : i)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selected === i ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"}`}>{member.name}</button>
            ))}
          </div>
        </div>
      </section>

      {/*  CASOS DE ÉXITO — BELAND */}
      <CasosDeExito />

      {/*  CIERRE */}
      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6 text-center py-16 px-6">
        LETS BUILD THE FUTURE <em className="italic underline decoration-blue-100"> TODAY </em>
      </h2>

      {/*  LATEST INSIGHTS */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-4">Stay updated with us</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase">Latest Insights</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-10">Explore our blog for industry trends, tech updates, and innovation stories.</p>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-slate-100">
                    {post.cover_url ? (<img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">NO IMAGE</div>)}
                  </div>
                  <h3 className="font-black text-lg mb-3 uppercase text-slate-900 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">{(() => { const raw = post.description?.replace(/<[^>]*>?/gm, '') || 'No description available'; const txt = document.createElement('textarea'); txt.innerHTML = raw; return txt.value; })()}</p>
                  <a href={`/blog/${post.id}`} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">Read More →</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center"><p className="text-slate-400 text-sm">No posts available yet.</p></div>
          )}
          <a href="/blog" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">View All Posts</a>
        </div>
      </section>

      {/*  FOOTER */}
      <footer className="py-20 text-center bg-white border-t border-slate-100">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Don&apos;t miss a move</p>
        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-10">Follow our <em className="italic underline decoration-blue-100">journey</em></h3>
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better.technologies?igsh=cjQ1c3F4OWpoYWhq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2026 Better Technologies.</p>
      </footer>

    </main>
  );
}