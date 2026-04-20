"use client";
// @ts-nocheck
import { useState } from "react";
import { supabase } from "../../lib/supabase";

const K = {
  dark: "#0a0e17", card: "#111827", border: "#1e293b", surface: "#0f1629",
  white: "#f0f4f8", gray: "#94a3b8", grayLight: "#64748b",
  accent: "#3b82f6", accentLight: "#60a5fa",
  gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  green: "#10b981", error: "#ef4444",
};

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSuccess("Compte créé ! Vérifiez vos emails pour confirmer votre adresse, puis connectez-vous.");
        setMode("login");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Redirect to demo or dashboard
        window.location.href = "/demo";
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: K.dark, color: K.white,
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: 'Outfit', sans-serif; }
      `}</style>

      <div style={{
        background: K.card, border: `1px solid ${K.border}`,
        borderRadius: 20, padding: 36, maxWidth: 440, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: K.gradient, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>K</div>
          <span style={{ fontSize: 26, fontWeight: 700 }}>Kōta</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
          {mode === "login" ? "Bon retour !" : "Créer un compte"}
        </h1>
        <p style={{ fontSize: 14, color: K.gray, textAlign: "center", marginBottom: 28 }}>
          {mode === "login" ? "Connectez-vous pour accéder à vos devis." : "Commencez à créer vos devis en 30 secondes."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: K.grayLight, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contact@durand-plomberie.fr"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: K.surface, border: `1px solid ${K.border}`,
                color: K.white, fontSize: 14, outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: K.grayLight, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 10,
                background: K.surface, border: `1px solid ${K.border}`,
                color: K.white, fontSize: 14, outline: "none",
              }}
            />
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: `${K.error}15`, border: `1px solid ${K.error}40`, borderRadius: 10, fontSize: 13, color: K.error }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ padding: "10px 14px", background: `${K.green}15`, border: `1px solid ${K.green}40`, borderRadius: 10, fontSize: 13, color: K.green }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px", borderRadius: 12, border: "none",
              background: K.gradient, color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1, marginTop: 8,
            }}
          >
            {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: K.gray }}>
          {mode === "login" ? (
            <>Pas encore de compte ? <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: K.accentLight, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Créer un compte</button></>
          ) : (
            <>Déjà inscrit ? <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} style={{ background: "none", border: "none", color: K.accentLight, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Se connecter</button></>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 20, paddingTop: 20, borderTop: `1px solid ${K.border}`, fontSize: 12, color: K.grayLight }}>
          <a href="/" style={{ color: K.grayLight, textDecoration: "none" }}>← Retour à l'accueil</a>
        </div>
      </div>
    </div>
  );
}
