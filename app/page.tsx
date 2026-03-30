import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#f8f9fa] text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white font-sans">
      
      {/* HEADER - TOOLBAR EN NEGRO (LOGO ORIGINAL) */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-10 md:px-24 py-5 z-50 backdrop-blur-md bg-black/90 border-b border-white/10">
        <div className="bg-white/10 p-2 rounded-lg"> {/* Un ligero fondo sutil para proteger los colores del logo si es necesario */}
          <Image 
            src="/logo.jpeg" 
            alt="Better Technologies" 
            width={140} 
            height={40} 
            className="object-contain" // Eliminamos el invert para que se vea original
          />
        </div>
        <button className="text-[10px] tracking-[0.2em] font-black border border-white/30 text-white px-6 py-2 hover:bg-white hover:text-black transition-all uppercase rounded-sm">
          Start
        </button>
      </header>

      {/* HERO CON VIDEO CLARO */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/50 backdrop-brightness-110"></div>
        </div>

        <div className="relative z-10 px-6 mt-20">
          <p className="text-blue-600 uppercase tracking-[0.4em] mb-6 text-xs font-black">Find a way to do better</p>
          <h1 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter max-w-5xl text-slate-900">
            Build and validate <br /> businesses in 72 hours
          </h1>
          <p className="mt-10 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Evolution comes from finding a way to do better. <br /> 
            <span className="text-slate-900 font-bold">We build the world of tomorrow, today.</span>
          </p>
          <button className="mt-12 px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-blue-600 transition-all shadow-2xl shadow-black/20">
            72h Challenge
          </button>
        </div>
      </section>

      {/* WHAT WE ARE */}
      <section className="py-40 px-6 text-center bg-white">
        <h2 className="text-blue-600 uppercase tracking-widest text-xs font-bold mb-8">What we are</h2>
        <p className="text-4xl md:text-6xl font-bold max-w-5xl mx-auto leading-tight tracking-tight text-slate-800 italic">
          "We are a Public Venture Lab. <br /> We build and validate businesses in public."
        </p>
        <div className="mt-20 inline-flex flex-col items-center">
          <p className="text-slate-400 uppercase tracking-[0.2em] text-[10px] mb-2 font-bold">Real Time Certainty (RTC)</p>
          <p className="text-3xl font-light border-b-2 border-blue-600 pb-2 text-slate-900 uppercase">Our kitchen is always open.</p>
        </div>
      </section>

      {/* TARGET CLIENT: MITTELSTAND */}
      <section className="py-40 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900">Our Customer: <br /><span className="text-blue-600">Mittelstand</span></h2>
            <ul className="space-y-6 text-xl text-slate-600 font-medium">
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full" /> 50-500 employees</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Solid revenues & Traditional business</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full" /> Dynamic markets</li>
              <li className="text-sm text-slate-400 mt-4 italic font-normal">Example: industrial manufacturers, retail, logistics, services</li>
            </ul>
          </div>
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-slate-900">The Problem we solve</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              They know they need innovation, but don't know how — and believe they don't have the budget.
            </p>
            <div className="space-y-3 opacity-60">
               <p className="text-sm line-through decoration-red-500 font-medium">BCG Digital Ventures</p>
               <p className="text-sm line-through decoration-red-500 font-medium">McKinsey & Company</p>
               <p className="text-sm line-through decoration-red-500 font-medium">Accenture</p>
               <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Typical tickets: €150k - €1M+</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & SPEED */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl md:text-5xl font-black mb-20 text-slate-900 uppercase tracking-tighter">What you <span className="text-blue-600">can</span> afford</h2>
        <div className="grid md:grid-cols-2 gap-12">
          
          <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-black transition-all duration-500 bg-white">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900 uppercase">72h Innovation Sprint</h3>
              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">€3k – €10k</span>
            </div>
            <ul className="space-y-4 text-slate-500 group-hover:text-black transition-colors">
              <li className="font-medium">• Idea Validation: Problem + Solution</li>
              <li className="font-medium">• Opportunity Validation</li>
              <li className="font-medium">• Functional prototype / insight harvesting tool</li>
            </ul>
          </div>

          <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-black transition-all duration-500 bg-white shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900 uppercase">8 week Speed process</h3>
              <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-black">€30k – €120k</span>
            </div>
            <ul className="space-y-4 text-slate-500 group-hover:text-black transition-colors">
              <li className="font-medium">• Solution engineering</li>
              <li className="font-medium">• Functional MVP</li>
              <li className="font-medium">• Beta testing (with real users)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 text-center bg-black p-12 rounded-3xl text-white">
            <p className="uppercase tracking-[0.3em] text-xs mb-4 font-bold opacity-60">Also available</p>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Growth / Scale (Tailor Made)</h3>
            <p className="mt-6 text-slate-400 max-w-3xl mx-auto text-lg italic font-light">
                Business Engineering + Organic Growth + Product Engineering + Social Lab + Content Solutions.
            </p>
        </div>
      </section>

      {/* 72H CHALLENGE */}
      <section className="py-40 px-6 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase leading-[0.8] tracking-tighter italic">While others <br /> pitch, <span className="text-black/40">we do.</span></h2>
          <p className="text-xl md:text-2xl leading-relaxed mb-16 text-blue-100 max-w-3xl font-medium">
            Once a month we choose a pain in society and we build and test viable prototypes any user in the world could test.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {["Industry 4.0", "AI Automation", "IOT", "Fintech", "Agile Frameworks", "Organic Growth"].map((item) => (
              <div key={item} className="border border-white/20 p-6 rounded-xl hover:bg-white hover:text-blue-600 transition-all cursor-default font-black uppercase text-[10px] tracking-widest">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="py-40 px-6 text-center bg-white">
        <h2 className="text-blue-600 uppercase tracking-widest text-xs font-black mb-12">Why we exist</h2>
        <p className="text-3xl md:text-5xl font-bold max-w-4xl mx-auto leading-relaxed text-slate-900">
          "Because times of uncertainty require answers. We build businesses in <span className="underline decoration-blue-600 decoration-4">weeks, not months</span>."
        </p>
        <div className="mt-32 flex flex-col items-center">
            <div className="flex gap-4 md:gap-8 mb-4">
                {['S','M','A','R','T'].map((l) => (
                    <span key={l} className="text-4xl md:text-6xl font-black text-slate-100">{l}</span>
                ))}
            </div>
            <p className="text-slate-400 max-w-md text-xs font-bold tracking-widest uppercase">Simple • Marketable • Agile • Results-driven • Time-bounded</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 px-6 text-center border-t border-slate-100 bg-[#f8f9fa]">
        <p className="text-slate-400 mb-10 italic font-medium uppercase text-xs tracking-widest">"We were told the future would be built somewhere else. We chose to prove them wrong!"</p>
        <h2 className="text-5xl md:text-[100px] font-black tracking-tighter leading-none text-slate-900 uppercase">
          Let’s build <br /> the future. <span className="text-blue-600">Today.</span>
        </h2>
        <button className="mt-16 px-14 py-6 bg-black text-white rounded-full font-black text-xl hover:bg-blue-600 transition-all hover:scale-105 shadow-2xl">
          Start your 72h validation
        </button>
      </section>

      <footer className="py-10 text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] border-t border-slate-100 bg-white">
        &copy; {new Date().getFullYear()} Better Technologies. All rights reserved.
      </footer>
    </main>
  );
}