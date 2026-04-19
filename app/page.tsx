"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";

// ─── KŌTA BRAND SYSTEM ─────────────────────────────────────
// Modern tech startup: dark base, electric blue accent, bold geometry
const K = {
  // Core
  dark: "#0a0e17",
  darkCard: "#111827",
  darkBorder: "#1e293b",
  darkSurface: "#0f1629",
  // Text
  white: "#f8fafc",
  gray: "#94a3b8",
  grayLight: "#64748b",
  grayDark: "#334155",
  // Accent — electric blue
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "#3b82f620",
  accentStrong: "#2563eb",
  // Secondary accents
  green: "#10b981",
  orange: "#f59e0b",
  pink: "#ec4899",
  // Gradients
  gradientMain: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  gradientDark: "linear-gradient(180deg, #0a0e17, #111827)",
  gradientCard: "linear-gradient(135deg, #111827, #1e293b40)",
};

export default function KotaLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = (id, delay = 0) => ({
    opacity: visibleSections.has(id) ? 1 : 0,
    transform: visibleSections.has(id) ? "translateY(0)" : "translateY(40px)",
    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  const handleSubmit = () => {
    if (email.includes("@")) {
      fetch("https://formspree.io/f/mqewbend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    }
  };

  return (
    <div style={{ background: K.dark, color: K.white, fontFamily: "'Outfit', sans-serif", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        [id] { scroll-margin-top: 80px; }
        ::selection { background: ${K.accent}40; color: ${K.white}; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px ${K.accent}30; } 50% { box-shadow: 0 0 40px ${K.accent}50; } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes counter { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        .hover-lift { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        details summary::-webkit-details-marker { display: none; }
        details[open] summary svg { transform: rotate(180deg); }
        details summary svg { transition: transform 0.2s ease; }
        details[open] > div { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        .glow-border { position: relative; }
        .glow-border::before { content: ''; position: absolute; inset: -1px; border-radius: inherit; background: linear-gradient(135deg, ${K.accent}40, transparent, ${K.accent}20); z-index: -1; }
        a { color: inherit; text-decoration: none; }
        input { font-family: 'Outfit', sans-serif; }
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 20px",
        background: scrollY > 50 ? `${K.dark}ee` : "transparent",
        backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
        borderBottom: scrollY > 50 ? `1px solid ${K.darkBorder}` : "1px solid transparent",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: K.gradientMain, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#fff",
          }}>K</div>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
            Kōta
          </span>
        </div>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth",block:"start"})} style={{ fontSize: 14, color: K.gray, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>Fonctionnalités</a>
          <a onClick={()=>document.getElementById("how")?.scrollIntoView({behavior:"smooth",block:"start"})} style={{ fontSize: 14, color: K.gray, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>Comment ça marche</a>
          <a onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth",block:"start"})} style={{ fontSize: 14, color: K.gray, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>Tarifs</a>
          <a onClick={()=>document.getElementById("faq")?.scrollIntoView({behavior:"smooth",block:"start"})} style={{ fontSize: 14, color: K.gray, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}>FAQ</a>
        </div>
        <button onClick={()=>setShowDemoModal(true)} className="nav-cta-desktop" style={{
          background: K.gradientMain, color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s",
        }}>Essai gratuit</button>
        <button className="hamburger" onClick={()=>setMobileMenu(!mobileMenu)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 8,
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          <span style={{ width: 24, height: 2, background: K.white, borderRadius: 2, transition: "all 0.2s", transform: mobileMenu ? "rotate(45deg) translate(5px, 5px)" : "none" }}/>
          <span style={{ width: 24, height: 2, background: K.white, borderRadius: 2, transition: "all 0.2s", opacity: mobileMenu ? 0 : 1 }}/>
          <span style={{ width: 24, height: 2, background: K.white, borderRadius: 2, transition: "all 0.2s", transform: mobileMenu ? "rotate(-45deg) translate(5px, -5px)" : "none" }}/>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="mobile-menu" style={{
          position: "fixed", top: 68, left: 0, right: 0, zIndex: 99,
          background: `${K.dark}f5`, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${K.darkBorder}`,
          padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
        }}>
          {[{label:"Fonctionnalités",id:"features"},{label:"Comment ça marche",id:"how"},{label:"Tarifs",id:"pricing"},{label:"FAQ",id:"faq"}].map(item=>(
            <a key={item.id} onClick={()=>{document.getElementById(item.id)?.scrollIntoView({behavior:"smooth",block:"start"});setMobileMenu(false);}} style={{
              padding: "14px 16px", fontSize: 16, color: K.gray, fontWeight: 500, cursor: "pointer",
              borderRadius: 10, transition: "background 0.2s",
            }}>{item.label}</a>
          ))}
          <button onClick={()=>{setShowDemoModal(true);setMobileMenu(false);}} style={{
            background: K.gradientMain, color: "#fff", border: "none",
            borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", marginTop: 8, width: "100%",
          }}>Essai gratuit</button>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
          backgroundImage: `linear-gradient(${K.accent} 1px, transparent 1px), linear-gradient(90deg, ${K.accent} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Glow orbs */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${K.accent}15, transparent 70%)`, top: "10%", left: "10%", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, #8b5cf615, transparent 70%)`, bottom: "10%", right: "10%", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 8px",
          background: K.accentGlow, border: `1px solid ${K.accent}30`, borderRadius: 100,
          fontSize: 13, color: K.accentLight, fontWeight: 500, marginBottom: 32,
          animation: "pulse-glow 3s ease infinite",
        }}>
          <span style={{ background: K.accent, color: "#fff", borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>NOUVEAU</span>
          Propulsé par l'intelligence artificielle
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 900, textAlign: "center",
          lineHeight: 1.05, letterSpacing: "-2px", maxWidth: 900,
          marginBottom: 24, position: "relative",
        }}>
          Vos devis en{" "}
          <span style={{
            background: K.gradientMain, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite",
          }}>30 secondes</span>
          <br />pas en 30 minutes.
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: K.gray, textAlign: "center",
          maxWidth: 580, lineHeight: 1.7, marginBottom: 40,
        }}>
          Décrivez votre chantier. L'IA génère un devis conforme, détaillé et prêt à envoyer. Conçu pour les plombiers. Bientôt pour tous les artisans.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>
          <button onClick={()=>setShowDemoModal(true)} style={{
            background: K.gradientMain, color: "#fff", border: "none",
            borderRadius: 14, padding: "16px 36px", fontSize: 17, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            boxShadow: `0 8px 32px ${K.accent}30`,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            Commencer gratuitement
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button onClick={()=>window.location.href="/demo"} style={{
            background: "transparent", color: K.white, border: `1px solid ${K.darkBorder}`,
            borderRadius: 14, padding: "16px 32px", fontSize: 17, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={K.accent} stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            Voir la démo
          </button>
        </div>

        {/* Demo preview */}
        <div style={{
          width: "100%", maxWidth: 800, borderRadius: 20, overflow: "hidden",
          border: `1px solid ${K.darkBorder}`, boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 60px ${K.accent}10`,
          background: K.darkCard, position: "relative",
        }}>
          {/* Mock chat interface */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${K.darkBorder}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981" }} />
            </div>
            <span style={{ fontSize: 13, color: K.grayLight, marginLeft: 8 }}>Kōta — Assistant devis</span>
          </div>
          <div style={{ padding: "24px 24px 20px" }}>
            {/* User message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <div style={{ background: K.accent, color: "#fff", borderRadius: "16px 16px 4px 16px", padding: "12px 16px", fontSize: 14, maxWidth: "70%" }}>
                Remplacement chauffe-eau 200L chez M. Dupont, 12 rue de la Paix Paris 15e, dépose ancien ballon
              </div>
            </div>
            {/* AI message */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: K.gradientMain, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>K</div>
              <div style={{ background: K.darkSurface, border: `1px solid ${K.darkBorder}`, borderRadius: "16px 16px 16px 4px", padding: "12px 16px", fontSize: 14, color: K.gray, maxWidth: "75%" }}>
                Chauffe-eau 200L, classique ! Je te prépare le devis avec dépose + pose + fourniture...
              </div>
            </div>
            {/* Generated devis card */}
            <div style={{ marginLeft: 38, background: K.darkSurface, border: `1px solid ${K.darkBorder}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${K.darkBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>DEV-2026-003</div>
                  <div style={{ fontSize: 12, color: K.grayLight }}>M. Dupont — Chauffe-eau 200L</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: `${K.orange}20`, color: K.orange }}>brouillon</span>
              </div>
              <div style={{ padding: "8px 16px", fontSize: 13 }}>
                {[
                  { desc: "Déplacement", price: "40,00", color: K.green },
                  { desc: "Dépose ancien chauffe-eau", price: "110,00", color: K.orange },
                  { desc: "Atlantic Zénéo 200L", price: "750,00", color: K.accent },
                  { desc: "Pose et raccordement", price: "165,00", color: K.orange },
                ].map((l) => (
                  <div key={l.desc} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${K.dark}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: l.color }} />
                      <span style={{ color: K.gray }}>{l.desc}</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>{l.price} €</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", background: `${K.accent}08`, borderTop: `1px solid ${K.darkBorder}`, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                <span>Total TTC</span><span style={{ color: K.accentLight }}>1 375,00 €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex" }}>
            {["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: "50%", background: c, border: `2px solid ${K.dark}`,
                marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>{String.fromCharCode(65 + i)}</div>
            ))}
          </div>
          <span style={{ fontSize: 14, color: K.grayLight }}>
            Rejoint par <strong style={{ color: K.white }}>200+</strong> artisans en France
          </span>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ padding: "40px 24px", borderTop: `1px solid ${K.darkBorder}`, borderBottom: `1px solid ${K.darkBorder}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[
            { value: "30s", label: "Temps moyen par devis", accent: K.accent },
            { value: "100%", label: "Conforme légalement", accent: K.green },
            { value: "5x", label: "Plus rapide que Word", accent: K.orange },
            { value: "0€", label: "Pour commencer", accent: K.pink },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 40, fontWeight: 900, color: s.accent, letterSpacing: "-2px", fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 14, color: K.grayLight, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" data-reveal style={{ padding: "100px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={reveal("features")}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: K.accent, textTransform: "uppercase", letterSpacing: "2px" }}>Fonctionnalités</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
              Tout ce qu'il faut.<br />Rien de plus.
            </h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {[
            {
              icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
              title: "Chat intelligent",
              desc: "Décrivez votre chantier en langage naturel. Dictez ou tapez. L'IA comprend et génère.",
              color: K.accent,
            },
            {
              icon: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
              title: "Dictée vocale",
              desc: "Les mains sales ? Appuyez sur le micro et parlez. Parfait sur le chantier.",
              color: K.green,
            },
            {
              icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
              title: "Devis conformes",
              desc: "SIRET, TVA, assurance décennale, mentions légales... tout est pré-rempli automatiquement.",
              color: K.orange,
            },
            {
              icon: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
              title: "Envoi en 1 clic",
              desc: "Envoyez le devis par email ou lien. Le client signe en ligne. Fini les allers-retours.",
              color: K.pink,
            },
            {
              icon: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z",
              title: "Tarifs intelligents",
              desc: "Vos tarifs, votre marge, vos prestations. L'IA s'adapte à VOTRE façon de travailler.",
              color: "#8b5cf6",
            },
            {
              icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
              title: "PDF professionnel",
              desc: "Export PDF impeccable en un clic. Votre logo, vos couleurs, prêt à imprimer.",
              color: K.accentLight,
            },
          ].map((f, i) => (
            <div key={f.title} id={`feat-${i}`} data-reveal className="hover-lift" style={{
              ...reveal(`feat-${i}`, i * 0.1),
              background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
              borderRadius: 18, padding: 28, cursor: "default",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: `${f.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: K.gray, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" data-reveal style={{ padding: "80px 24px 100px", background: K.darkSurface }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ ...reveal("how"), textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: K.green, textTransform: "uppercase", letterSpacing: "2px" }}>Simple</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>3 étapes. 30 secondes.</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {[
              { num: "01", title: "Décrivez le chantier", desc: "En texte ou en vocal, comme vous parleriez à un collègue. \"Fuite sous évier, remplacement siphon, chez Mme Martin.\"", color: K.accent },
              { num: "02", title: "L'IA génère le devis", desc: "Lignes détaillées, bons prix, bonnes unités, mentions légales. Basé sur vos tarifs personnels et vos prestations enregistrées.", color: K.green },
              { num: "03", title: "Envoyez au client", desc: "Un clic pour envoyer par email ou partager un lien. Le client visualise, accepte et signe en ligne.", color: K.orange },
            ].map((step, i) => (
              <div key={step.num} id={`step-${i}`} data-reveal className="step-hover" style={{
                ...reveal(`step-${i}`, i * 0.15),
                display: "flex", gap: 24, alignItems: "flex-start",
                padding: "24px 20px", borderRadius: 16,
                transition: "all 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${step.color}10`; e.currentTarget.style.boxShadow = `0 0 30px ${step.color}15`; e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.querySelector('.step-num').style.color = step.color; e.currentTarget.querySelector('.step-bar').style.borderColor = step.color; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.querySelector('.step-num').style.color = `${step.color}20`; e.currentTarget.querySelector('.step-bar').style.borderColor = `${step.color}30`; }}
              >
                <div className="step-num" style={{
                  fontSize: 48, fontWeight: 900, color: `${step.color}20`, fontFamily: "'JetBrains Mono', monospace",
                  lineHeight: 1, minWidth: 70, textAlign: "right", transition: "color 0.3s ease",
                }}>{step.num}</div>
                <div className="step-bar" style={{ borderLeft: `2px solid ${step.color}30`, paddingLeft: 24, paddingBottom: 8, transition: "border-color 0.3s ease" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: K.gray, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROI SECTION ═══ */}
      <section id="roi" data-reveal style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ ...reveal("roi"), textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: K.green, textTransform: "uppercase", letterSpacing: "2px" }}>Retour sur investissement</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
            Kōta coûte 40€.<br/>Kōta vous rapporte 1100€.
          </h2>
          <p style={{ fontSize: 17, color: K.gray, marginTop: 16, maxWidth: 600, margin: "16px auto 0" }}>
            Un artisan perd en moyenne <strong style={{color: K.white}}>5 heures par semaine</strong> sur ses devis. À 55€/h facturables, c'est <strong style={{color: K.green}}>1100€/mois qui partent en fumée</strong>.
          </p>
        </div>

        {/* ROI Calculator visual */}
        <div className="hover-lift" style={{
          background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
          borderRadius: 20, padding: "40px 32px", maxWidth: 800, margin: "0 auto",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, alignItems: "center" }}>
            <div style={{ textAlign: "center", minWidth: 140 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: K.grayLight, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Sans Kōta</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#ef4444", lineHeight: 1 }}>-1100€</div>
              <div style={{ fontSize: 12, color: K.grayLight, marginTop: 8 }}>perdus par mois</div>
            </div>
            <div style={{ fontSize: 24, color: K.grayLight, fontWeight: 300 }}>+</div>
            <div style={{ textAlign: "center", minWidth: 140 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: K.accentLight, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Kōta Pro</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: K.white, lineHeight: 1 }}>-40€</div>
              <div style={{ fontSize: 12, color: K.grayLight, marginTop: 8 }}>d'abonnement</div>
            </div>
            <div style={{ fontSize: 24, color: K.grayLight, fontWeight: 300 }}>=</div>
            <div style={{ textAlign: "center", minWidth: 140 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: K.green, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Économie nette</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: K.green, lineHeight: 1 }}>+1060€</div>
              <div style={{ fontSize: 12, color: K.grayLight, marginTop: 8 }}>par mois</div>
            </div>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${K.darkBorder}`, textAlign: "center" }}>
            <div style={{ fontSize: 14, color: K.gray, lineHeight: 1.7 }}>
              <strong style={{ color: K.white }}>Concrètement :</strong> chaque devis pris 45 min à 30 secondes, c'est <strong style={{ color: K.accentLight }}>26 fois plus rapide</strong>. Sur une semaine à 12 devis, vous récupérez une demi-journée complète.
            </div>
          </div>
        </div>

        {/* Arguments complémentaires */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 32 }}>
          {[
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Plus de temps sur les chantiers", desc: "Les heures gagnées sur les devis = plus de chantiers facturés." },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Zéro risque d'amende", desc: "Jusqu'à 3000€ d'amende pour un devis non conforme. Kōta le rend impossible." },
            { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Meilleure conversion", desc: "Un devis envoyé rapidement = un client qui signe. 2x plus de taux d'acceptation." },
          ].map((a) => (
            <div key={a.title} style={{
              background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
              borderRadius: 14, padding: 20, display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${K.green}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: K.gray, lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" data-reveal style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ ...reveal("pricing"), textAlign: "center", marginBottom: 64 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: K.orange, textTransform: "uppercase", letterSpacing: "2px" }}>Tarifs</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
            Un prix pour chaque taille.
          </h2>
          <p style={{ fontSize: 16, color: K.gray, marginTop: 12 }}>Gratuit pour tester. Pas d'engagement. Résiliable en un clic.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
          {/* Starter */}
          <div className="hover-lift" style={{
            background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
            borderRadius: 20, padding: 32,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: K.gray, marginBottom: 8 }}>Starter</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900 }}>0€</span>
              <span style={{ fontSize: 14, color: K.grayLight }}>/mois</span>
            </div>
            <div style={{ fontSize: 12, color: K.grayLight, marginBottom: 20 }}>Pour tester sans risque</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["5 devis / mois", "Chat IA basique", "Export PDF conforme", "Mentions légales auto"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: K.gray }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {f}
                </div>
              ))}
            </div>
            <button onClick={()=>setShowDemoModal(true)} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: "transparent", border: `1px solid ${K.darkBorder}`,
              color: K.white, fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>Commencer gratuitement</button>
          </div>

          {/* Pro */}
          <div className="hover-lift" style={{
            background: K.gradientCard, border: `2px solid ${K.accent}`,
            borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
            boxShadow: `0 0 40px ${K.accent}20`,
          }}>
            <div style={{ position: "absolute", top: 16, right: 16, background: K.gradientMain, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>POPULAIRE</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: K.accentLight, marginBottom: 8 }}>Pro</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900 }}>39,99€</span>
              <span style={{ fontSize: 14, color: K.grayLight }}>/mois</span>
            </div>
            <div style={{ fontSize: 12, color: K.accentLight, marginBottom: 20, fontWeight: 500 }}>Pour artisans solos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {["Devis illimités", "Chat IA avancé", "Dictée vocale", "Photo chantier IA", "Envoi email + PDF", "Espace comptable dédié", "Support prioritaire"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: K.gray }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={K.accent} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {f}
                </div>
              ))}
            </div>
            <button onClick={()=>setShowDemoModal(true)} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: K.gradientMain, border: "none",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 20px ${K.accent}30`,
            }}>Essai gratuit 14 jours</button>
          </div>

          {/* Business */}
          <div className="hover-lift" style={{
            background: K.gradientCard, border: `1px solid #8b5cf640`,
            borderRadius: 20, padding: 32, position: "relative", overflow: "hidden",
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>Business</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 900 }}>99,99€</span>
              <span style={{ fontSize: 14, color: K.grayLight }}>/mois</span>
            </div>
            <div style={{ fontSize: 12, color: "#a78bfa", marginBottom: 20, fontWeight: 500 }}>Pour TPE & PME du bâtiment</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                { name: "Tout du plan Pro", soon: false },
                { name: "Jusqu'à 5 utilisateurs", soon: false },
                { name: "Signature électronique", soon: true },
                { name: "Relances automatiques", soon: false },
                { name: "Logo personnalisé", soon: false },
                { name: "Intégration Sage / Cegid", soon: true },
                { name: "Account manager dédié", soon: false },
              ].map((f) => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: K.gray }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <span>{f.name}</span>
                  {f.soon && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${K.orange}20`, color: K.orange, textTransform: "uppercase", letterSpacing: "0.5px" }}>Bientôt</span>}
                </div>
              ))}
            </div>
            <button onClick={()=>setShowDemoModal(true)} style={{
              width: "100%", padding: "14px", borderRadius: 12,
              background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", border: "none",
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 20px #8b5cf630`,
            }}>Essai gratuit 14 jours</button>
          </div>
        </div>

        {/* ROI reminder */}
        <div style={{ textAlign: "center", marginTop: 40, padding: "20px 24px", background: `${K.green}10`, border: `1px solid ${K.green}30`, borderRadius: 14, maxWidth: 700, margin: "40px auto 0" }}>
          <div style={{ fontSize: 14, color: K.gray, lineHeight: 1.7 }}>
            <strong style={{ color: K.green }}>💡 Rappel :</strong> Kōta Pro à 39,99€ vous fait gagner en moyenne <strong style={{ color: K.white }}>1100€/mois</strong> en temps récupéré. ROI : <strong style={{ color: K.green }}>x27</strong>.
          </div>
        </div>
      </section>

      {/* ═══ ESPACE COMPTABLE ═══ */}
      <section id="comptable" data-reveal style={{ padding: "100px 24px", background: K.darkSurface }}>
        <div style={{ ...reveal("comptable"), maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: K.green, textTransform: "uppercase", letterSpacing: "2px" }}>Pour les comptables</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
              Votre comptable va vous adorer.
            </h2>
            <p style={{ fontSize: 16, color: K.gray, marginTop: 12, maxWidth: 600, margin: "12px auto 0" }}>
              Fini les photos de devis envoyées par WhatsApp. Votre comptable accède à tout en un clic.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", title: "Un lien, zéro friction", desc: "Partagez un lien unique à votre comptable. Il accède à tous vos devis sans installer d'app, sans créer de compte." },
              { icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3", title: "Export CSV en un clic", desc: "Votre comptable télécharge le récapitulatif (HT, TVA, TTC) directement importable dans Sage, Cegid ou Excel." },
              { icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6", title: "Tous les PDF d'un coup", desc: "Un bouton pour télécharger tous les devis en PDF dans un zip. Trié par période, par statut, par client." },
            ].map((f) => (
              <div key={f.title} className="hover-lift" style={{
                background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
                borderRadius: 16, padding: 28,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${K.green}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: K.gray, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HISTOIRE ═══ */}
      <section id="histoire" data-reveal style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ ...reveal("histoire"), textAlign: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: K.pink, textTransform: "uppercase", letterSpacing: "2px" }}>L'histoire</span>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
            Pourquoi j'ai créé Kōta.
          </h2>
        </div>

        <div className="hover-lift" style={{
          background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
          borderRadius: 20, padding: "40px 36px", position: "relative",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: K.gradientMain, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, flexShrink: 0 }}>HT</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Hugo Theys</div>
              <div style={{ fontSize: 13, color: K.accentLight }}>Fondateur de Kōta</div>
            </div>
          </div>

          <div style={{ fontSize: 16, color: K.gray, lineHeight: 1.9 }}>
            <p style={{ marginBottom: 20 }}>
              Je ne sais pas coder. Mon parcours, c'est le sport management, l'esport, la communication digitale. Pendant des années, j'ai eu des idées de produits sans jamais pouvoir les construire.
            </p>
            <p style={{ marginBottom: 20 }}>
              Et puis un jour, j'ai regardé un artisan passer <strong style={{ color: K.white }}>45 minutes à rédiger un devis sur Word</strong>. Un document que 80% des artisans font mal — mentions légales oubliées, erreurs de calcul, mise en page bancale.
            </p>
            <p style={{ marginBottom: 20 }}>
              Je me suis dit : on a des IA qui écrivent des dissertations en 10 secondes, mais un plombier doit encore se battre avec Excel pour facturer un remplacement de siphon ?
            </p>
            <p style={{ marginBottom: 20 }}>
              Grâce à l'intelligence artificielle, j'ai pu construire ce que j'avais en tête. <strong style={{ color: K.white }}>Pas parfaitement. Pas comme un dev senior le ferait. Mais ça marche.</strong> Et c'est conforme légalement.
            </p>
            <p style={{ color: K.accentLight, fontWeight: 600, fontSize: 17 }}>
              Kōta, c'est l'outil que j'aurais voulu voir exister. Alors je l'ai construit.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" data-reveal style={{ padding: "100px 24px", background: K.darkSurface }}>
        <div style={{ ...reveal("faq"), maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: K.accentLight, textTransform: "uppercase", letterSpacing: "2px" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginTop: 12, letterSpacing: "-1px" }}>
              Questions fréquentes
            </h2>
          </div>

          {[
            { q: "Est-ce que mes devis sont vraiment conformes légalement ?", a: "Oui. Kōta intègre automatiquement les 16 mentions obligatoires : SIRET, TVA, assurance décennale, conditions de paiement, droit de rétractation, attestation TVA taux réduit, etc. Conforme à l'arrêté du 24 janvier 2017 et au Code de la consommation." },
            { q: "Je suis nul en informatique, c'est compliqué ?", a: "Non. Si vous savez envoyer un SMS, vous savez utiliser Kōta. Vous parlez ou tapez comme vous le feriez avec un collègue, et l'IA fait le reste. Vous pouvez même dicter votre devis à la voix." },
            { q: "Mes données sont-elles sécurisées ?", a: "Vos données sont hébergées en Europe et chiffrées. Vous restez propriétaire de toutes vos données. Nous ne partageons rien avec des tiers." },
            { q: "Est-ce que ça marche sans internet ?", a: "La génération IA nécessite une connexion internet. Mais vos devis existants restent accessibles hors ligne, et vous pouvez les envoyer dès que vous retrouvez du réseau." },
            { q: "C'est quoi la différence avec Obat ou Batappli ?", a: "Ces outils sont des logiciels de gestion classiques. Kōta est un assistant IA conversationnel : vous décrivez le chantier en langage naturel et le devis se génère en 30 secondes. Pas de formulaires à remplir, pas de menus déroulants." },
            { q: "Mon comptable peut accéder aux devis ?", a: "Oui. Vous partagez un lien unique à votre comptable. Il accède à un tableau de bord en lecture seule avec tous vos devis, et peut exporter en CSV en un clic. Aucune installation requise." },
            { q: "Je peux annuler à tout moment ?", a: "Oui, sans engagement. Le plan Starter est gratuit à vie (5 devis/mois). Le plan Pro se résilie en un clic, sans frais cachés." },
          ].map((faq, i) => (
            <details key={i} style={{
              background: K.gradientCard, border: `1px solid ${K.darkBorder}`,
              borderRadius: 14, marginBottom: 10, overflow: "hidden",
            }}>
              <summary style={{
                padding: "18px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer",
                listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center",
                color: K.white,
              }}>
                {faq.q}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={K.grayLight} strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
              </summary>
              <div style={{ padding: "0 24px 18px", fontSize: 14, color: K.gray, lineHeight: 1.7 }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{
        padding: "100px 24px", textAlign: "center", position: "relative",
        background: K.darkSurface,
      }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${K.accent}08, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>
            Prêt à gagner du temps ?
          </h2>
          <p style={{ fontSize: 18, color: K.gray, marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
            Rejoignez les artisans qui ont déjà automatisé leurs devis.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", maxWidth: 460, margin: "0 auto" }}>
            {!submitted ? (
              <>
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    flex: 1, padding: "16px 20px", borderRadius: 14,
                    background: K.darkCard, border: `1px solid ${K.darkBorder}`,
                    color: K.white, fontSize: 16, outline: "none",
                  }}
                />
                <button onClick={handleSubmit} style={{
                  background: K.gradientMain, color: "#fff", border: "none",
                  borderRadius: 14, padding: "16px 28px", fontSize: 16, fontWeight: 700,
                  cursor: "pointer", whiteSpace: "nowrap",
                  boxShadow: `0 4px 20px ${K.accent}30`,
                }}>S'inscrire</button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: K.green, fontSize: 18, fontWeight: 600 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                C'est noté ! On vous contacte bientôt.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "40px 24px 32px", borderTop: `1px solid ${K.darkBorder}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1100, margin: "0 auto", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: K.gradientMain, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>K</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Kōta</span>
          <span style={{ color: K.grayDark, fontSize: 13, marginLeft: 8 }}>© 2026</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Mentions légales", "CGU", "Confidentialité", "Contact"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: K.grayLight }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* ═══ DEMO MODAL ═══ */}
      {showDemoModal && (
        <div onClick={()=>setShowDemoModal(false)} style={{
          position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20,
          animation:"fadeIn 0.2s ease",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:K.darkCard,border:`1px solid ${K.darkBorder}`,borderRadius:20,
            maxWidth:480,width:"100%",padding:40,textAlign:"center",
            boxShadow:"0 40px 80px rgba(0,0,0,0.5)",position:"relative",
          }}>
            <button onClick={()=>setShowDemoModal(false)} style={{
              position:"absolute",top:16,right:16,background:"none",border:"none",
              cursor:"pointer",padding:8,color:K.grayLight,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div style={{width:72,height:72,borderRadius:20,background:K.gradientMain,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:900,color:"#fff",boxShadow:`0 8px 24px ${K.accent}40`}}>K</div>

            <h3 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Kōta arrive bientôt !</h3>
            <p style={{fontSize:15,color:K.gray,lineHeight:1.6,marginBottom:24}}>
              Le produit est en phase de bêta privée.<br/>
              Laissez votre email pour être parmi les premiers à y accéder.
            </p>

            {!submitted ? (
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
                  autoFocus
                  style={{
                    padding:"14px 18px",borderRadius:12,
                    background:K.dark,border:`1px solid ${K.darkBorder}`,
                    color:K.white,fontSize:15,outline:"none",textAlign:"center",
                  }}
                />
                <button onClick={handleSubmit} style={{
                  background:K.gradientMain,color:"#fff",border:"none",
                  borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,
                  cursor:"pointer",boxShadow:`0 4px 20px ${K.accent}30`,
                }}>Rejoindre la bêta</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"20px 0"}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:`${K.green}20`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div style={{fontSize:18,fontWeight:700,color:K.green}}>C'est noté !</div>
                <div style={{fontSize:13,color:K.gray}}>On vous contacte dès l'ouverture de la bêta.</div>
              </div>
            )}

            <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${K.darkBorder}`,fontSize:12,color:K.grayLight}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                Gratuit · Sans engagement · Sans carte bancaire
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
