import React, { useState, useRef, useEffect } from 'react';
import memojiImg from '../assets/memoji.png';
import showcaseVideo from '../assets/Showcase.mov';

export const Home: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isContactHighlighted, setIsContactHighlighted] = useState(false);
  const [polandTime, setPolandTime] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const isManuallyPaused = useRef(false);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        setIsContactHighlighted(true);
        setTimeout(() => setIsContactHighlighted(false), 1800);
      }, 500);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setPolandTime(time);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Automatically play when in viewport (threshold 35%), pause when scrolled out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isManuallyPaused.current) {
              video.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {});
            }
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.35, // Trigger when at least 35% of the video frame is visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('it_bjacob@icloud.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      isManuallyPaused.current = false;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    } else {
      isManuallyPaused.current = true;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skillCategories = [
    {
      label: 'LANGUAGES & RUNTIMES',
      skills: [
        { name: 'JavaScript', desc: 'Interactive web' },
        { name: 'TypeScript', desc: 'Type-safe code' },
        { name: 'Golang (Go)', desc: 'High-throughput services' },
        { name: 'Node.js', desc: 'Best for I/O bound apps' },
        { name: 'Swift', desc: 'Development for Apple systems'},
      ],
    },
    {
      label: 'FRONTEND & DESIGN CRAFT',
      skills: [
        { name: 'HTML & CSS', desc: 'Designing & styling websites' },
        { name: 'Tailwind CSS', desc: 'Easier styling' },
        { name: 'React', desc: 'Modern JS library for UI' },
        { name: 'Next.js', desc: 'Performance & SEO out of the box' },
        { name: 'Angular', desc: 'Component-based SPA framework' },
        { name: 'Swift UI', desc: 'UI framework for Apple platforms' },
      ],
    },
    {
      label: 'INFRASTRUCTURE & DEVOPS',
      skills: [
        { name: 'Git & GitHub', desc: 'Version control & collaboration' },
        { name: 'GitOps', desc: 'Infra with Git as source of truth' },
        { name: 'Docker', desc: 'Containerization' },
        { name: 'AWS S3 API', desc: 'Object storage' },
        { name: 'PostgreSQL', desc: 'Relational data modeling' },
        { name: 'Redis', desc: 'In-memory caching & ephemeral state' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-mono text-sm selection:bg-black selection:text-white p-6 md:p-12 lg:p-24 max-w-4xl mx-auto rounded-xl border border-gray-300">
      
      <header className="mb-24 flex justify-between items-start">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-bold tracking-tight">JACOBINOO / FULL-STACK DEVELOPER</h1>
            <a 
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-[10px] text-emerald-700 font-semibold tracking-wide hover:bg-emerald-100/80 hover:border-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
              title="Jump to Get in Touch"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              OPEN TO WORK
            </a>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">based in Poland</p>
            {polandTime && (
              <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex items-center gap-1" title="Current time in Warsaw, Poland">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {polandTime}
              </span>
            )}
          </div>
        </div>
        <a 
          href="#contact" 
          onClick={scrollToContact}
          className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 decoration-1"
        >
          Get in touch
        </a>
      </header>

      <main className="space-y-32">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-4 flex items-center justify-center">
            <img 
              src={memojiImg} 
              alt="Avatar / Memoji"
              className="w-48 h-48 md:w-56 md:h-56 object-contain select-none"
            />
          </div>
          <div className="md:col-span-8 space-y-4 leading-relaxed max-w-xl">
            <h2 className="uppercase tracking-widest text-xs text-gray-400 pb-2 border-b border-gray-100 font-semibold">About</h2>
            <p>
              I am a passionate developer and computer science student, focused on creating <mark className="bg-yellow-200 px-1 rounded-sm text-black">robust, secure, and intuitive applications</mark>. My journey involves deep dives into both frontend aesthetics and backend architecture.
            </p>
            <p>
              I specialize in building <mark className="bg-yellow-200 px-1 rounded-sm text-black">high-performance digital experiences</mark> and scalable cloud architecture. When I'm not coding, I'm exploring new technologies, refining my understanding of system design, or dreaming about the next big thing.
            </p>
            <p>
              I don't just write code; I build the things I wish existed.
            </p>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex justify-between items-baseline pb-2 border-b border-gray-200">
            <h2 className="uppercase tracking-widest text-xs text-gray-500 font-semibold">Technologies & Skills</h2>
            <span className="text-xs text-gray-400 uppercase">[Tech I Love]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                  {group.label}
                </h3>
                <ul className="space-y-2">
                  {group.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 py-1 border-b border-dotted border-gray-100 text-xs">
                      <span className="font-semibold text-black">{skill.name}</span>
                      <span className="text-gray-500 text-[11px] sm:text-right">{skill.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-baseline pb-2 border-b border-gray-200">
            <h2 className="uppercase tracking-widest text-xs text-gray-500 font-semibold">Selected Work</h2>
            <span className="text-xs text-gray-400 uppercase">[Built with passion and lots of coffee]</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <h3 className="text-lg font-bold">Quartz Drive &mdash; E2EE Cloud Storage</h3>
            </div>
            
            <div className="border border-black bg-zinc-950 overflow-hidden relative shadow-sm group">
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800 text-[11px] text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span className="font-mono text-zinc-300">
                    Showcase.mp4 {isPlaying ? '[PLAYING]' : '[PAUSED]'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-white text-black hover:bg-zinc-200 text-[11px] font-bold tracking-tight transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      <span>Play</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative cursor-pointer" onClick={togglePlayPause}>
                <video 
                  ref={videoRef}
                  src={showcaseVideo}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-auto object-cover bg-black select-none block"
                />

                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px] transition-all">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl">
                      <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
              <div className="md:col-span-8 space-y-6">
                <p className="leading-relaxed text-gray-600">
                  A highly secure, <mark className="bg-yellow-200 px-1 rounded-sm text-black">end-to-end encrypted</mark> cloud storage system. Built with performance and privacy in mind, featuring <mark className="bg-yellow-200 px-1 rounded-sm text-black">zero-knowledge architecture</mark>. Open-sourced.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href="https://quartzapp.top?utm_source=portfolio&utm_medium=link"
                    target="_blank" 
                    rel="noopener"
                    className="group inline-flex items-center justify-center bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Live Demo <span className="ml-1.5 transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                  <a 
                    href="https://github.com/jacobinoo/quartz-drive"
                    target="_blank" 
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center border border-gray-300 text-black px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-black transition-colors"
                  >
                    GitHub Repo <span className="ml-1.5 transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                </div>
              </div>
              <div className="md:col-span-4 text-xs text-gray-500 uppercase flex flex-col space-y-1">
                <span>Next.js</span>
                <span>Libsodium + Web Crypto</span>
                <span>Golang</span>
                <span>PostgreSQL</span>
                <span>Redis</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className={`space-y-8 scroll-mt-20 py-4 px-6 -mx-6 rounded-2xl transition-all duration-700 ${
            isContactHighlighted 
              ? 'bg-emerald-50/70 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10' 
              : 'bg-transparent ring-0 ring-transparent shadow-none'
          }`}
        >
          <div className="flex justify-between items-baseline pb-2 border-b border-gray-200">
            <h2 className="uppercase tracking-widest text-xs text-gray-500 font-semibold">Get in Touch</h2>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all duration-500 text-[10px] font-semibold tracking-wide ${
              isContactHighlighted 
                ? 'border-emerald-600 bg-emerald-600 text-white scale-105' 
                : 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isContactHighlighted ? 'bg-white' : 'bg-emerald-500'} animate-pulse`} />
              OPEN TO WORK
            </span>
          </div>

          <div className="space-y-8">
            <p className="text-base text-gray-700 leading-relaxed max-w-xl">
              I am open to new opportunities. Feel free to reach out!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="mailto:it_bjacob@icloud.com"
                className="border border-black p-5 flex flex-col justify-between space-y-4 hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">/ EMAIL</div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-blue-600 group-hover:text-blue-800 break-all text-xs">it_bjacob@icloud.com</div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        copyEmail();
                      }}
                      className={`transition-opacity p-1 rounded hover:bg-gray-200 ${copied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      title="Copy email"
                    >
                      {copied ? (
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-gray-500 hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-xs pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-500">Send an email</span>
                  <span className="font-bold text-blue-600 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </a>

              <a
                href="https://github.com/jacobinoo"
                target="_blank" 
                rel="noreferrer" 
                className="border border-black p-5 flex flex-col justify-between space-y-4 hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">/ GITHUB</div>
                  <div className="font-semibold text-blue-600 group-hover:text-blue-800 text-xs">github.com/jacobinoo</div>
                </div>
                <div className="text-xs pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-500">Repositories</span>
                  <span className="font-bold text-blue-600 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/banjacob"
                target="_blank" 
                rel="noreferrer" 
                className="border border-black p-5 flex flex-col justify-between space-y-4 hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">/ LINKEDIN</div>
                  <div className="font-semibold text-blue-600 group-hover:text-blue-800 text-xs">linkedin.com/in/banjacob</div>
                </div>
                <div className="text-xs pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-gray-500">Network</span>
                  <span className="font-bold text-blue-600 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-32 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-baseline gap-4 text-xs text-gray-500">
        <div>&copy; {new Date().getFullYear()} Jacobinoo</div>
        <div className="flex space-x-6 uppercase tracking-widest text-[11px]">
          <a href="mailto:it_bjacob@icloud.com" className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-4">Email</a>
          <a href="https://github.com/jacobinoo" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-4">GitHub</a>
          <a href="https://linkedin.com/in/banjacob" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-4">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};
