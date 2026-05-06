"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Globe, Code2, Search, Megaphone,
  Palette, Bot, Database, Sun, Moon, ArrowRight, Star, Menu, X,
  MapPin, ChevronRight, Zap, Heart, Target, Play,
  Mail, Phone, Video
} from "lucide-react";

// ─── Theme Toggle ───────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") { setDark(true); document.documentElement.setAttribute("data-theme","dark"); }
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["About", "Services", "Journey", "Presence", "Testimonials", "Contact"];
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.3s ease",
        padding: "0 5%",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "var(--gradient)",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16
          }}>N</div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>
            <span className="gradient-text">Nex</span>geno
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: "var(--text-secondary)", textDecoration: "none",
              fontSize: 14, fontWeight: 500, transition: "color 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--grad-start)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
            >{l}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--border)",
            background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text-secondary)", transition: "all 0.3s"
          }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="btn-primary" style={{ padding: "10px 22px", fontSize: 13 }}>
            Get Started <ArrowRight size={14} />
          </button>

          {/* Mobile menu */}
          <button onClick={() => setOpen(!open)} style={{
            background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", display: "none"
          }} className="mobile-menu-btn">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: "var(--nav-bg)", backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border)", overflow: "hidden"
            }}
          >
            <div style={{ padding: "20px 5%" }}>
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} style={{
                  display: "block", padding: "12px 0", color: "var(--text-secondary)",
                  textDecoration: "none", fontSize: 15, fontWeight: 500,
                  borderBottom: "1px solid var(--border)"
                }}>{l}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)"
      }} />

      <motion.div style={{ y, opacity, maxWidth: 1280, margin: "0 auto", padding: "0 5%", position: "relative", zIndex: 1, width: "100%", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 24 }}
        >
          <span className="section-label">
            🚀 Since 2008 · Mumbai, India
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}
        >
          <span className="gradient-text">17 Years</span> of<br />
          Digital Excellence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}
        >
          Your Partner for Digital Success. We craft 360° digital marketing, Web, and AI solutions that push your business to the top.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <button className="btn-primary">
            Start Your Journey <ArrowRight size={16} />
          </button>
          <button className="btn-secondary">
            <Play size={15} /> Watch Our Story
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
            marginTop: 72, padding: "36px 40px",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 24, boxShadow: "var(--shadow-lg)",
            maxWidth: 700, margin: "72px auto 0"
          }}
        >
          {[{ n: 17, s: "+", label: "Years of Excellence" }, { n: 45, s: "+", label: "Expert Team Members" }, { n: 100, s: "+", label: "Happy Clients" }, { n: 4.8, s: "/5", label: "Google Rating" }].map((stat, i) => (
            <div key={i} style={{ textAlign: "center", flex: "1 1 120px" }}>
              <div className="stat-number"><Counter target={stat.n} suffix={stat.s} /></div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: 28, height: 44, borderRadius: 14, border: "2px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "6px 0" }}
        >
          <div style={{ width: 4, height: 10, borderRadius: 2, background: "var(--gradient)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const pillars = [
    { icon: <Zap size={20} />, title: "Innovation First", desc: "Next-gen solutions for modern challenges" },
    { icon: <Heart size={20} />, title: "Client-Focused", desc: "Your success is our mission" },
    { icon: <Target size={20} />, title: "Proven Results", desc: "17 years of measurable growth" },
  ];
  return (
    <section id="about" style={{ padding: "120px 5%", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <FadeIn>
          <span className="section-label">Our Story</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: 24, letterSpacing: -1 }}>
            17 Years of Building Businesses,{" "}
            <span className="gradient-text">One Click at a Time</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20, fontSize: 16 }}>
            We&apos;re Nexgeno, a Mumbai-based digital marketing agency that&apos;s been helping businesses shine online since 2008. From crafting websites that tell your story to boosting your brand with SEO and digital marketing, we&apos;re here to make your business grow—step by step, with heart and hustle.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, fontSize: 16 }}>
            Starting as a small hardware shop in 2008, we&apos;ve grown into a full-fledged digital agency offering everything from killer website design to SEO that gets you noticed and digital marketing that hits every channel. We&apos;re not about flashy promises—we&apos;re about results that matter.
          </p>
          <button className="btn-primary">
            Learn More <ArrowRight size={15} />
          </button>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 8 }}
                className="card"
                style={{ padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 20 }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", flexShrink: 0
                }}>{p.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>{p.desc}</div>
                </div>
              </motion.div>
            ))}

            {/* Rating badge */}
            <div className="card" style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#f6c90e" color="#f6c90e" />)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, lineHeight: 1 }} className="gradient-text">4.8/5</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Google Rating</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function Team() {
  const leaders = [
    {
      name: "Arif Khan", role: "CEO & Founder", emoji: "👨‍💼",
      desc: "The heart of Nexgeno. A born problem-solver, always ready to roll up his sleeves and find a way forward. His passion for helping businesses fuels everything we do.",
      color: "#3885DE"
    },
    {
      name: "Tamir Khan", role: "CTO & Co-Founder", emoji: "👨‍💻",
      desc: "The tech brain, turning ideas into reality. From coding stunning websites to exploring AI for your business, he's always thinking about what's next.",
      color: "#C053AE"
    }
  ];
  return (
    <section style={{ padding: "80px 5%", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <span className="section-label">Leadership</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: -1, marginBottom: 60 }}>
            Meet Our <span className="gradient-text">Leaders</span>
          </h2>
        </FadeIn>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {leaders.map((l, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="card"
                style={{ padding: "40px 36px", maxWidth: 380, textAlign: "center", cursor: "default" }}
              >
                <div style={{
                  width: 90, height: 90, borderRadius: "50%", fontSize: 42,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(135deg, ${l.color}20, ${l.color}40)`,
                  margin: "0 auto 20px", border: `2px solid ${l.color}40`
                }}>{l.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{l.name}</div>
                <div className="gradient-text" style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{l.role}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{l.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Journey Timeline ─────────────────────────────────────────────────────────
function Journey() {
  const milestones = [
    { year: "2008", title: "The Beginning", persons: "01 Person", desc: "Our journey began with Mr. Arif, a strong technical foundation, and a clear belief in solving problems through hardware, networking, sales, services, and training. Driven by big ambition and a vision to build something meaningful.", emoji: "🚀" },
    { year: "2011", title: "Stepping into the Digital World", persons: "02 Persons", desc: "With growing confidence and vision, we registered makent.in and entered the world of web development. Using HTML, CSS, and Bootstrap, a two-member team laid the foundation for a growing digital presence.", emoji: "🌐" },
    { year: "2014", title: "Leadership and Growth", persons: "04 Persons", desc: "The arrival of our partner Mr. Tamir marked a major turning point. Under his leadership, we expanded into professional website design and PHP development, delivering impactful projects.", emoji: "📈" },
    { year: "2015", title: "Going Global", persons: "07 Persons", desc: "We crossed borders and delivered international projects for clients in South Africa, USA, Canada, China, Indonesia, UAE, UK, Botswana, Saudi Arabia, Mauritius, Qatar, and Australia.", emoji: "🌍" },
    { year: "2017", title: "Digital Marketing Era", persons: "12 Persons", desc: "Launched full-service digital marketing capabilities, including SEO, PPC, and social media marketing. Client base grew exponentially with measurable ROI-driven campaigns.", emoji: "📣" },
    { year: "2019", title: "UI/UX & Design Studio", persons: "20 Persons", desc: "Established a dedicated design studio offering world-class UI/UX services. Our team of designers brought cutting-edge aesthetics to clients across industries.", emoji: "🎨" },
    { year: "2021", title: "AI Integration", persons: "35 Persons", desc: "Pioneered AI-driven solutions for business automation and customer experience. Became one of the first Mumbai agencies to offer AI-powered CRM and chatbot integrations.", emoji: "🤖" },
    { year: "2023", title: "360° Full Stack Agency", persons: "42 Persons", desc: "Evolved into a complete 360° digital agency offering every service under one roof — from branding to AI. Crossed 100+ satisfied clients globally.", emoji: "⭐" },
    { year: "2026", title: "Present Day", persons: "45+ Persons", desc: "Today, Nexgeno stands as a beacon of digital innovation in Mumbai with a 4.8/5 Google rating, 17+ years of excellence, and a team of 45+ passionate experts ready to take your business to new heights.", emoji: "🏆" },
  ];

  return (
    <section id="journey" style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 80 }}>
          <span className="section-label">Our Journey</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: -1 }}>
            <span className="gradient-text">Our Journey</span> in Numbers
          </h2>
        </FadeIn>

        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: "50%", top: 0, bottom: 0,
            width: 2, transform: "translateX(-50%)",
            background: "var(--gradient)", opacity: 0.3,
          }} />

          {milestones.map((m, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div style={{
                display: "flex", gap: 40, marginBottom: 60, alignItems: "flex-start",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse"
              }}>
                {/* Card */}
                <div style={{ flex: 1, display: "flex", justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="card"
                    style={{ padding: "28px", maxWidth: 380, width: "100%" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ fontSize: 28 }}>{m.emoji}</span>
                      <div>
                        <div className="gradient-text" style={{ fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{m.year}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{m.persons}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{m.title}</div>
                    <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7 }}>{m.desc}</p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, flexShrink: 0, paddingTop: 28 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: "var(--gradient)",
                    boxShadow: "0 0 20px rgba(56, 133, 222, 0.6)",
                    position: "relative", zIndex: 1
                  }} />
                </div>

                <div style={{ flex: 1 }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    { icon: <Code2 size={22} />, title: "Website Design & Development", desc: "Beautiful, responsive websites that tell your story and drive results" },
    { icon: <Search size={22} />, title: "SEO Optimization", desc: "Get to the top of Google with our proven SEO strategies" },
    { icon: <Megaphone size={22} />, title: "360° Digital Marketing", desc: "From social media to email campaigns, we cover every channel" },
    { icon: <Palette size={22} />, title: "UI/UX Design", desc: "User experiences that delight and convert visitors into customers" },
    { icon: <Bot size={22} />, title: "AI Solutions", desc: "Cutting-edge AI integration to streamline your operations" },
    { icon: <Database size={22} />, title: "CRM Systems", desc: "Custom CRM solutions to manage your customer relationships" },
  ];
  return (
    <section id="services" style={{ padding: "120px 5%", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">What We Do</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            Your Growth, <span className="gradient-text">Our Game Plan</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
            360-degree digital solutions tailored to your business goals and budget
          </p>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                className="card"
                style={{ padding: "32px", cursor: "default" }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", marginBottom: 20
                }}>{s.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: "var(--grad-start)", fontSize: 13, fontWeight: 600 }}>
                  Learn more <ChevronRight size={14} />
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Global Presence Map ───────────────────────────────────────────────────────
function GlobalPresence() {
  const countries = [
    { name: "USA", x: 18, y: 37, flag: "🇺🇸" },
    { name: "Canada", x: 20, y: 27, flag: "🇨🇦" },
    { name: "UK", x: 46, y: 28, flag: "🇬🇧" },
    { name: "South Africa", x: 52, y: 68, flag: "🇿🇦" },
    { name: "Saudi Arabia", x: 57, y: 44, flag: "🇸🇦" },
    { name: "UAE", x: 60, y: 46, flag: "🇦🇪" },
    { name: "Qatar", x: 59, y: 45, flag: "🇶🇦" },
    { name: "India", x: 66, y: 46, flag: "🇮🇳" },
    { name: "China", x: 74, y: 36, flag: "🇨🇳" },
    { name: "Indonesia", x: 77, y: 58, flag: "🇮🇩" },
    { name: "Australia", x: 80, y: 72, flag: "🇦🇺" },
    { name: "Botswana", x: 52, y: 65, flag: "🇧🇼" },
    { name: "Mauritius", x: 58, y: 68, flag: "🇲🇺" },
  ];

  const [hover, setHover] = useState<string | null>(null);

  return (
    <section id="presence" style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">Global Presence</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            Across <span className="gradient-text">The Globe</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
            Delivering excellence across 13 countries and counting
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="card" style={{ padding: "40px", position: "relative", overflow: "hidden" }}>
            {/* Simplified SVG World Map */}
            <div style={{ position: "relative", paddingBottom: "50%" }}>
              <svg
                viewBox="0 0 1000 500"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.25 }}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified continents */}
                <path d="M180 120 L280 100 L320 130 L310 200 L260 220 L200 210 L170 170 Z" fill="var(--grad-start)" />
                <path d="M320 130 L450 90 L520 110 L540 180 L460 200 L380 190 L310 200 Z" fill="var(--grad-start)" />
                <path d="M460 90 L600 80 L650 120 L640 200 L580 220 L500 200 L460 160 Z" fill="var(--grad-start)" />
                <path d="M580 200 L650 190 L660 280 L620 300 L570 270 Z" fill="var(--grad-start)" />
                <path d="M640 100 L780 90 L820 150 L790 220 L720 240 L660 200 Z" fill="var(--grad-start)" />
                <path d="M720 220 L820 210 L860 300 L820 360 L750 340 L710 280 Z" fill="var(--grad-start)" />
                <path d="M100 250 L200 240 L220 340 L160 380 L90 350 Z" fill="var(--grad-start)" />
                <path d="M200 240 L280 250 L260 360 L200 380 L180 340 Z" fill="var(--grad-start)" />
              </svg>

              {/* Country dots */}
              {countries.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  style={{
                    position: "absolute",
                    left: `${c.x}%`, top: `${c.y}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 10, cursor: "pointer"
                  }}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div style={{ position: "relative" }}>
                    <motion.div
                      style={{
                        position: "absolute", top: "50%", left: "50%",
                        width: 28, height: 28, borderRadius: "50%",
                        border: "2px solid rgba(56, 133, 222, 0.5)",
                        transform: "translate(-50%, -50%)"
                      }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                    />
                    <div style={{
                      width: 12, height: 12, borderRadius: "50%",
                      background: "var(--gradient)",
                      boxShadow: "0 0 10px rgba(56, 133, 222, 0.6)"
                    }} />
                  </div>
                  {hover === c.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--bg-card)", border: "1px solid var(--border)",
                        borderRadius: 8, padding: "6px 12px", whiteSpace: "nowrap",
                        fontSize: 13, fontWeight: 600, boxShadow: "var(--shadow)",
                        display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      {c.flag} {c.name}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Country chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
              {countries.map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 50,
                    background: "var(--bg)", border: "1px solid var(--border)",
                    fontSize: 13, fontWeight: 500, color: "var(--text-secondary)"
                  }}
                >
                  {c.flag} {c.name}
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Awards ────────────────────────────────────────────────────────────────────
function Awards() {
  const awards = [
    { icon: "🥇", title: "Best Digital Agency", year: "2023", by: "Mumbai Business Awards" },
    { icon: "🏆", title: "Top SEO Agency", year: "2022", by: "India Digital Summit" },
    { icon: "⭐", title: "Excellence in Innovation", year: "2021", by: "Tech Leaders Forum" },
    { icon: "🎖️", title: "Client Satisfaction Award", year: "2020", by: "Digital Conclave India" },
    { icon: "🌟", title: "Rising Agency of the Year", year: "2019", by: "Web Marketing Association" },
    { icon: "💡", title: "AI Pioneer Award", year: "2024", by: "Future Tech India" },
  ];
  return (
    <section style={{ padding: "120px 5%", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">Recognition</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: -1 }}>
            Award <span className="gradient-text">Winning Agency</span>
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {awards.map((a, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="card"
                style={{ padding: "36px 28px", textAlign: "center", position: "relative", overflow: "hidden" }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{a.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 6 }}>{a.title}</div>
                <div className="gradient-text" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{a.year}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{a.by}</div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brands / Clients ─────────────────────────────────────────────────────────
function Brands() {
  const brands = ["Makent", "GECI", "TechCorp", "GlobalNet", "DigiBrand", "WebPro", "Nexus", "CloudBase", "StartUpX", "MediaHub"];
  return (
    <section style={{ padding: "80px 5%", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Trusted By</span>
          <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 800, letterSpacing: -0.5 }}>
            Brands That <span className="gradient-text">Trust Us</span>
          </h2>
        </FadeIn>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", gap: 40 }} className="marquee-inner">
            {[...brands, ...brands].map((b, i) => (
              <div key={i} style={{
                padding: "18px 36px", background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 12,
                fontWeight: 700, fontSize: 15, color: "var(--text-secondary)",
                whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.3s"
              }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: "Rajesh Mehta", role: "CEO, TechStartup Mumbai", text: "Nexgeno transformed our digital presence completely. Our website traffic tripled within 6 months and leads are pouring in. Best investment we made!", rating: 5, flag: "🇮🇳" },
    { name: "Sarah Johnson", role: "Marketing Head, GlobalTrade UK", text: "Working with Nexgeno has been exceptional. Their SEO expertise and attention to detail are unmatched. We saw a 200% increase in organic traffic.", rating: 5, flag: "🇬🇧" },
    { name: "Ahmed Al-Rashid", role: "Founder, Dubai Ventures UAE", text: "The team at Nexgeno delivered our e-commerce platform on time and beyond expectations. Their AI solutions have automated 60% of our operations.", rating: 5, flag: "🇦🇪" },
    { name: "Lisa Thompson", role: "Director, Toronto Retail Canada", text: "Nexgeno's digital marketing campaigns brought us 150+ qualified leads per month. Arif and his team are true professionals. Highly recommend!", rating: 5, flag: "🇨🇦" },
  ];
  return (
    <section id="testimonials" style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <FadeIn style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="section-label">Testimonials</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: -1 }}>
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} className="card" style={{ padding: "32px" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#f6c90e" color="#f6c90e" />)}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", fontSize: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--bg)", border: "1px solid var(--border)"
                  }}>{t.flag}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Vision / Values ─────────────────────────────────────────────────────────
function Vision() {
  return (
    <section style={{ padding: "80px 5%", background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {[
            { label: "Our Vision", icon: "🔭", title: "Leading the Future", desc: "To lead businesses into the future with digital solutions that are smart, bold, and built to last. We envision a world where every business, big or small, has the digital power to compete globally." },
            { label: "Our Values", icon: "💎", title: "What Drives Us", desc: "Integrity, Innovation, Impact. We believe in transparent partnerships, cutting-edge thinking, and delivering results that genuinely move the needle for your business." },
          ].map((v, i) => (
            <FadeIn key={i} delay={i * 0.15}>
              <motion.div whileHover={{ scale: 1.02 }} className="card" style={{ padding: "48px 40px" }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>{v.icon}</div>
                <div className="section-label" style={{ marginBottom: 16 }}>{v.label}</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>
                  <span className="gradient-text">{v.title}</span>
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 15 }}>{v.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section id="contact" style={{ padding: "120px 5%", position: "relative", overflow: "hidden" }}>
      <div className="orb" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(56, 133, 222, 0.2) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <FadeIn>
          <span className="section-label">Get Started</span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 900, letterSpacing: -2, lineHeight: 1.1, marginBottom: 24 }}>
            Ready to <span className="gradient-text">Grow Your</span> Business?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, marginBottom: 48, lineHeight: 1.7 }}>
            Let&apos;s build something extraordinary together. 17 years of expertise, one simple goal — your success.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }}>
              Start a Project <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" style={{ fontSize: 16, padding: "16px 40px" }}>
              <Phone size={16} /> Call Us Today
            </button>
          </div>

          {/* Contact info */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: <Mail size={16} />, text: "hello@nexgeno.com" },
              { icon: <Phone size={16} />, text: "+91 98765 43210" },
              { icon: <MapPin size={16} />, text: "Mumbai, India" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: 14 }}>
                <span className="gradient-text">{c.icon}</span> {c.text}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const socials = [
    { icon: "IG", label: "Instagram" },
    { icon: "in", label: "LinkedIn" },
    { icon: "𝕏", label: "Twitter" },
    { icon: "fb", label: "Facebook" },
    { icon: "▶", label: "YouTube" },
  ];
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "60px 5% 40px", background: "var(--bg-card)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: "var(--gradient)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16
              }}>N</div>
              <span style={{ fontWeight: 800, fontSize: 20 }}><span className="gradient-text">Nex</span>geno</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Mumbai&apos;s premier digital agency since 2008. Growing businesses with heart and hustle.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {socials.map((s, i) => (
              <motion.a key={i} whileHover={{ y: -3, scale: 1.1 }} href="#" title={s.label} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--bg)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)", textDecoration: "none", transition: "all 0.3s"
              }}><span style={{fontWeight:700,fontSize:13}}>{s.icon}</span></motion.a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
            © 2024 Nexgeno. All rights reserved. Made with ❤️ in Mumbai.
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Sitemap"].map(l => (
              <a key={l} href="#" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { dark, toggle } = useTheme();
  return (
    <>
      <Nav dark={dark} toggleTheme={toggle} />
      <main>
        <Hero />
        <About />
        <Team />
        <Services />
        <Journey />
        <GlobalPresence />
        <Awards />
        <Brands />
        <Testimonials />
        <Vision />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
