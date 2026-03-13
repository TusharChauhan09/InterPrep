"use client";

import "./landing.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import DashboardBtn from "@/components/DashboardBtn";

const Home = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [latency, setLatency] = useState(12);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const stickyWrapperRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 50) {
          navRef.current.classList.add("scrolled");
        } else {
          navRef.current.classList.remove("scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero animations on mount
  useEffect(() => {
    if (!mounted) return;
    // Animate split chars
    const chars = document.querySelectorAll(".lp-split-char");
    chars.forEach((char, i) => {
      const el = char as HTMLElement;
      setTimeout(() => {
        el.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100 + i * 40);
    });
    // Show subtitle + CTA
    setTimeout(() => {
      if (heroSubRef.current) {
        heroSubRef.current.style.opacity = "1";
        heroSubRef.current.style.transform = "translateY(0)";
      }
    }, 1200);
    setTimeout(() => {
      heroCtaRef.current?.classList.add("visible");
    }, 1500);
  }, [mounted]);

  // Latency ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas (dark mode only)
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fill();
      });
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  // Scroll-based reveal
  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".lp-reveal-up, .lp-timeline-item").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [mounted]);

  // Sticky section scroll handler
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const wrapper = stickyWrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const totalScroll = wrapper.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll));
      const index = Math.min(2, Math.floor(progress * 3));

      // Update text blocks
      wrapper.querySelectorAll(".lp-sticky-text-block").forEach((el) => {
        el.classList.remove("active");
        if (Number((el as HTMLElement).dataset.index) === index) {
          el.classList.add("active");
        }
      });
      // Update visual panels
      wrapper.querySelectorAll(".lp-visual-panel").forEach((el) => {
        el.classList.remove("active");
        if (Number((el as HTMLElement).dataset.index) === index) {
          el.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Timeline progress
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const section = document.querySelector(".lp-timeline-section");
      if (!section || !timelineProgressRef.current) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.scrollHeight;
      const scrolled = -rect.top + window.innerHeight * 0.5;
      const progress = Math.max(0, Math.min(100, (scrolled / sectionHeight) * 100));
      timelineProgressRef.current.style.height = `${progress}%`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Counter animation
  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseFloat(el.dataset.target || "0");
            const decimals = parseInt(el.dataset.decimals || "0");
            const suffix = el.dataset.suffix || "";
            let current = 0;
            const step = target / 60;
            const animate = () => {
              current += step;
              if (current >= target) {
                el.textContent = decimals > 0 ? target.toFixed(decimals) + suffix : Math.floor(target).toLocaleString() + suffix;
                return;
              }
              el.textContent = decimals > 0 ? current.toFixed(decimals) + suffix : Math.floor(current).toLocaleString() + suffix;
              requestAnimationFrame(animate);
            };
            animate();
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".lp-counter").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  // Typewriter effect for code editor
  useEffect(() => {
    if (!mounted) return;
    const target = document.getElementById("lp-typewriter-target");
    if (!target) return;
    const lines = [
      '<span class="lp-keyword">function</span> <span class="lp-string">solveProblem</span>(input) {',
      '  <span class="lp-keyword">const</span> result = [];',
      '  <span class="lp-keyword">for</span> (<span class="lp-keyword">let</span> i = 0; i &lt; input.length; i++) {',
      '    result.push(input[i] * 2);',
      '  }',
      '  <span class="lp-keyword">return</span> result;',
      '}',
    ];
    let lineIndex = 0;
    const addLine = () => {
      if (lineIndex >= lines.length) return;
      const div = document.createElement("div");
      div.innerHTML = lines[lineIndex];
      div.style.opacity = "0";
      div.style.transform = "translateY(10px)";
      target.appendChild(div);
      setTimeout(() => {
        div.style.transition = "opacity 0.3s, transform 0.3s";
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
      }, 50);
      lineIndex++;
      setTimeout(addLine, 400);
    };
    setTimeout(addLine, 2000);
  }, [mounted]);

  // Split text into chars for animation
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="lp-split-char" style={{ display: "inline-block" }}>
        {char}
      </span>
    ));
  };

  if (!mounted) return null;

  return (
    <div className="landing-page">
      <div className="lp-noise-overlay" />

      {/* ===== NAV ===== */}
      <nav className="lp-nav" ref={navRef}>
        <Link href="/" className="lp-logo">INTERPREP</Link>

        {/* Desktop nav links (hidden on mobile) */}
        <div className="lp-nav-links">
          <span className="lp-nav-pill">v4.0.2</span>
          <a href="#sticky-features">Platform</a>
          <a href="#cards-section">Solutions</a>
          <a href="#timeline-section">How It Works</a>
          <a href="#stats">Stats</a>
          <SignedOut>
            <SignInButton>
              <button className="lp-magnetic-btn">
                <span>Sign In</span>
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Always-visible nav items (theme, dashboard, profile, get started, hamburger) */}
        <div className="lp-nav-always">
          <button
            className="lp-theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <div className="lp-theme-toggle-knob">
              <span className="lp-theme-toggle-icon">
                {resolvedTheme === "dark" ? "☾" : "☀"}
              </span>
            </div>
          </button>

          <SignedIn>
            <DashboardBtn />
            <UserButton />
          </SignedIn>

          <button
            className="lp-magnetic-btn lp-nav-get-started-desktop"
            onClick={() => router.push("/arena")}
          >
            <span>Get Started</span>
          </button>

          {/* Hamburger (mobile only) */}
          <button
            className={`lp-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div className={`lp-mobile-menu ${menuOpen ? "open" : ""}`}>
        <a href="#sticky-features" onClick={() => setMenuOpen(false)}>Platform</a>
        <a href="#cards-section" onClick={() => setMenuOpen(false)}>Solutions</a>
        <a href="#timeline-section" onClick={() => setMenuOpen(false)}>How It Works</a>
        <a href="#stats" onClick={() => setMenuOpen(false)}>Stats</a>
        <SignedOut>
          <SignInButton>
            <button className="lp-magnetic-btn" onClick={() => setMenuOpen(false)}>
              <span>Sign In</span>
            </button>
          </SignInButton>
        </SignedOut>
        <button
          className="lp-magnetic-btn lp-nav-get-started-mobile"
          onClick={() => { router.push("/arena"); setMenuOpen(false); }}
        >
          <span>Get Started</span>
        </button>
      </div>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <canvas id="lp-particle-canvas" ref={canvasRef} />
        <div className="lp-hero-top-grid">
          <span>SYS.VER 4.0.2</span>
          <span>● SECURE CONNECTION EST.</span>
          <span>LATENCY: <span>{latency}ms</span></span>
          <span className="lp-blink">[ REC ● ACTIVE ]</span>
        </div>
        <div className="lp-hero-title-container mt-2">
          <h1 className="lp-massive-text lp-solid-text">{splitText("INTER")}</h1>
          <h1 className="lp-massive-text">{splitText("PREP")}</h1>
          <div className="lp-hero-cta-group mb-2" ref={heroCtaRef}>
            <button
              className="lp-magnetic-btn"
              onClick={() => router.push("/arena")}
            >
              <span>{isSignedIn ? "Go to Dashboard" : "Start Free Trial"}</span>
            </button>
            <Link
              href="https://github.com/TusharChauhan09/InterPrep"
              target="_blank"
              className="lp-hero-secondary-btn"
            >
              <Github size={14} /> Repository
            </Link>
          </div>
        </div>
        <div className="lp-svg-bg-container">
          <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="300" stroke="#333" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="400" cy="400" r="200" stroke="#444" strokeWidth="2" />
            <path d="M400 0 L400 800 M0 400 L800 400" stroke="#222" strokeWidth="1" />
            <path d="M200 200 L600 600 M200 600 L600 200" stroke="#222" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="lp-marquee-wrapper mt-4">
        <div className="lp-marquee-content">
          LIVE CODE EDITOR // SMART SCHEDULING // VIDEO CONFERENCING // LOW LATENCY // ROLE DASHBOARDS // LIVE CODE EDITOR // SMART SCHEDULING // VIDEO CONFERENCING // LOW LATENCY // ROLE DASHBOARDS //&nbsp;
        </div>
      </div>
      <div className="lp-marquee-wrapper lp-reverse">
        <div className="lp-marquee-content" style={{ animationDirection: "reverse", animationDuration: "25s" }}>
          EVALUATE // HIRE // DEPLOY // ASSESS // SCALE // EVALUATE // HIRE // DEPLOY // ASSESS // SCALE // EVALUATE // HIRE // DEPLOY // ASSESS // SCALE //&nbsp;
        </div>
      </div>

      {/* ===== STICKY FEATURES ===== */}
      <section className="lp-sticky-section-wrapper lp-grid-bg" id="sticky-features" ref={stickyWrapperRef}>
        <div className="lp-sticky-container">
          <div className="lp-sticky-content">
            <div className="lp-sticky-text-block active" data-index="0">
              <h2>Real-time<br />Monaco.</h2>
              <p>Collaborative coding in the industry standard editor. Zero latency syncing, multi-cursor support, and native syntax highlighting for 40+ languages. Execute code instantly in isolated secure containers.</p>
            </div>
            <div className="lp-sticky-text-block" data-index="1">
              <h2>Integrated<br />Stream.io.</h2>
              <p>High-fidelity, low-latency video infrastructure built directly into the interview environment. Focus on the candidate, not the connection. Features active speaker detection and screen sharing.</p>
            </div>
            <div className="lp-sticky-text-block" data-index="2">
              <h2>Smart<br />Scheduling.</h2>
              <p>Automated calendar sync. Coordinate multi-stage interviews across different time zones effortlessly. Intelligent routing pairs candidates with appropriate technical interviewers.</p>
            </div>
          </div>

          <div className="lp-sticky-visuals">
            {/* Code Editor Panel */}
            <div className="lp-visual-panel active" data-index="0">
              <div className="lp-mockup-header">
                <div className="lp-mockup-dot" /><div className="lp-mockup-dot" /><div className="lp-mockup-dot" />
                <span className="lp-mockup-filename">interview.js</span>
              </div>
              <div className="lp-code-editor-body">
                <div className="lp-line-numbers">1<br />2<br />3<br />4<br />5<br />6<br />7<br />8</div>
                <div className="lp-code-content" id="lp-typewriter-target" />
              </div>
            </div>

            {/* Video Panel */}
            <div className="lp-visual-panel" data-index="1">
              <div className="lp-mockup-header">
                <div className="lp-mockup-dot" /><div className="lp-mockup-dot" /><div className="lp-mockup-dot" />
                <span className="lp-mockup-filename">Stream.io Active Session</span>
              </div>
              <div className="lp-video-grid">
                <div className="lp-video-tile speaking">
                  <img src="https://images.pexels.com/photos/3778602/pexels-photo-3778602.jpeg?auto=compress&cs=tinysrgb&w=800" className="lp-video-img" alt="Candidate" />
                  <div className="lp-video-label">CANDIDATE_01</div>
                </div>
                <div className="lp-video-tile">
                  <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800" className="lp-video-img" alt="Interviewer" />
                  <div className="lp-video-label">INTERVIEWER (YOU)</div>
                </div>
              </div>
            </div>

            {/* Schedule Panel */}
            <div className="lp-visual-panel" data-index="2">
              <div className="lp-mockup-header">
                <div className="lp-mockup-dot" /><div className="lp-mockup-dot" /><div className="lp-mockup-dot" />
                <span className="lp-mockup-filename">Schedule Overview</span>
              </div>
              <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="lp-schedule-item active">
                  <div>
                    <h4 className="lp-schedule-title">Frontend Eng L4</h4>
                    <p className="lp-schedule-desc">System Design w/ Alex</p>
                  </div>
                  <span className="lp-schedule-time">14:00 PST</span>
                </div>
                <div className="lp-schedule-item inactive">
                  <div>
                    <h4 className="lp-schedule-title">Backend Eng L5</h4>
                    <p className="lp-schedule-desc">Algo &amp; Data Structures</p>
                  </div>
                  <span className="lp-schedule-time">16:30 PST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARDS SECTION ===== */}
      <section className="lp-horizontal-section lp-reveal-up lp-grid-bg" id="cards-section">
        <div className="lp-section-header">
          <h2>The Architecture<br />of Assessment</h2>
        </div>
        <div style={{ overflowX: "auto", paddingBottom: "2rem", scrollbarWidth: "none" }}>
          <div className="lp-cards-track">
            <div className="lp-tilt-card">
              <div className="lp-card-num">01</div>
              <div className="lp-card-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
              </div>
              <div>
                <h3 className="lp-card-title">Role Based<br />Access</h3>
                <p className="lp-card-desc">Discrete environments for candidates, technical interviewers, and recruiters. Granular permissions and custom evaluation rubrics locked to specific roles.</p>
              </div>
            </div>
            <div className="lp-tilt-card">
              <div className="lp-card-num">02</div>
              <div className="lp-card-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
              <div>
                <h3 className="lp-card-title">Sandboxed<br />Execution</h3>
                <p className="lp-card-desc">Every interview spins up a sterile Docker container. Execute multi-file projects securely. Automated teardown upon session completion ensures data integrity.</p>
              </div>
            </div>
            <div className="lp-tilt-card">
              <div className="lp-card-num">03</div>
              <div className="lp-card-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <h3 className="lp-card-title">Playback<br />Review</h3>
                <p className="lp-card-desc">Full session recording including video, audio, and every keystroke in the editor. Review the candidate&apos;s exact problem-solving process post-interview.</p>
              </div>
            </div>
            <div className="lp-tilt-card">
              <div className="lp-card-num">04</div>
              <div className="lp-card-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
              </div>
              <div>
                <h3 className="lp-card-title">ATS<br />Integration</h3>
                <p className="lp-card-desc">Push feedback, scores, and recordings directly back to Greenhouse, Lever, or Workday. Seamless synchronization with your existing hiring stack.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE ===== */}
      <section className="lp-timeline-section lp-grid-bg" id="timeline-section">
        <div className="lp-timeline-line-wrapper">
          <div className="lp-timeline-line-bg" />
          <div className="lp-timeline-line-progress" ref={timelineProgressRef} />
        </div>
        <div className="lp-container" style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
          <div className="lp-timeline-section-header lp-reveal-up">
            <h2>How It Works</h2>
            <p>Four steps to a perfect technical interview</p>
          </div>

          <div className="lp-timeline-item lp-reveal-up" style={{ transitionDelay: "0.1s" }}>
            <div className="lp-timeline-step-label">Step 01 — Setup</div>
            <h3>Configuration</h3>
            <p>Define the interview rubric, select language constraints, and preload starting code templates from your GitHub repositories.</p>
            <div className="lp-timeline-tags">
              <span className="lp-timeline-tag">RUBRIC BUILDER</span>
              <span className="lp-timeline-tag">GITHUB SYNC</span>
            </div>
          </div>

          <div className="lp-timeline-item lp-reveal-up" style={{ transitionDelay: "0.2s" }}>
            <div className="lp-timeline-step-label">Step 02 — Onboard</div>
            <h3>Connection</h3>
            <p>Candidate and interviewer join the secure lobby. Hardware checks and connection stability verification are handled automatically via Stream.io.</p>
            <div className="lp-timeline-tags">
              <span className="lp-timeline-tag">STREAM.IO</span>
              <span className="lp-timeline-tag">LOBBY SYSTEM</span>
            </div>
          </div>

          <div className="lp-timeline-item lp-reveal-up" style={{ transitionDelay: "0.3s" }}>
            <div className="lp-timeline-step-label">Step 03 — Interview</div>
            <h3>Execution</h3>
            <p>Real-time collaborative session in the Monaco environment. The system records logic flow, compilation errors, and verbal communication.</p>
            <div className="lp-timeline-tags">
              <span className="lp-timeline-tag">MONACO EDITOR</span>
              <span className="lp-timeline-tag">SESSION RECORD</span>
            </div>
          </div>

          <div className="lp-timeline-item lp-reveal-up" style={{ transitionDelay: "0.4s" }}>
            <div className="lp-timeline-step-label">Step 04 — Decide</div>
            <h3>Evaluation</h3>
            <p>Post-session, the interviewer inputs structured feedback. Data is compiled into a comprehensive technical dossier synced to your ATS.</p>
            <div className="lp-timeline-tags">
              <span className="lp-timeline-tag">ATS SYNC</span>
              <span className="lp-timeline-tag">SCORECARD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="lp-stats-section lp-grid-bg" id="stats">
        <div className="lp-stat-block lp-reveal-up">
          <div className="lp-stat-num lp-counter" data-target="10000">0</div>
          <div className="lp-stat-label">Interviews Conducted</div>
        </div>
        <div className="lp-stat-block lp-reveal-up" style={{ transitionDelay: "0.1s" }}>
          <div className="lp-stat-num lp-counter" data-target="99.9" data-decimals="1" data-suffix="%">0</div>
          <div className="lp-stat-label">System Uptime</div>
        </div>
        <div className="lp-stat-block lp-reveal-up" style={{ transitionDelay: "0.2s" }}>
          <div className="lp-stat-num lp-counter" data-target="40" data-suffix="+">0</div>
          <div className="lp-stat-label">Supported Languages</div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="lp-footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#sticky-features">Code Editor</a></li>
              <li><a href="#sticky-features">Video Engine</a></li>
              <li><a href="#sticky-features">Scheduling</a></li>
              <li><a href="#cards-section">Security</a></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Solutions</h4>
            <ul>
              <li><a href="#cards-section">Enterprise</a></li>
              <li><a href="#cards-section">Startups</a></li>
              <li><a href="#cards-section">Bootcamps</a></li>
              <li><a href="#timeline-section">Universities</a></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="https://github.com/TusharChauhan09/InterPrep" target="_blank">GitHub</Link></li>
              <li><a href="#timeline-section">Documentation</a></li>
              <li><a href="#stats">Changelog</a></li>
              <li><a href="#stats">API Reference</a></li>
            </ul>
          </div>
          <div className="lp-footer-col">
            <h4>System Status</h4>
            <ul>
              <li className="lp-footer-status">● All Systems Operational</li>
              <li className="lp-footer-muted">Latency: ~{latency}ms</li>
              <li className="lp-footer-muted">Region: US-EAST-1</li>
            </ul>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2025 InterPrep. All rights reserved.</span>
          <span>Built for engineers, by engineers.</span>
        </div>
        <div className="lp-huge-footer-text">INTERPREP</div>
      </footer>
    </div>
  );
};

export default Home;
