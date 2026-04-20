"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const K = {
  dark: "#0a0e17", card: "#111827", border: "#1e293b", surface: "#0f1629",
  white: "#f0f4f8", gray: "#94a3b8", grayLight: "#64748b",
  accent: "#3b82f6", accentLight: "#60a5fa",
  gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  green: "#10b981", error: "#ef4444",
};

export default function AppPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        background: K.dark, color: K.white,
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 14, color: K.gray }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: K.dark, color: K.white,
      minHeight: "100vh", display: "flex", flexDirection: "column",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Header */}
      <div style={{
        padding: "16px 24px", background: K.card, borderBottom: `1px solid ${K.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: K.gradient, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900 }}>K</div>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Kōta</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: K.grayLight }}>{user?.email}</span>
          <button onClick={handleLogout} style={{
            padding: "8px 16px", borderRadius: 10, border: `1px solid ${K.border}`,
            background: "transparent", color: K.gray, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Déconnexion</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{
          background: K.card, border: `1px solid ${K.border}`,
          borderRadius: 20, padding: 40, maxWidth: 560, width: "100%", textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🚧</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            Bienvenue, {user?.email?.split("@")[0]} !
          </h1>
          <p style={{ fontSize: 15, color: K.gray, lineHeight: 1.7, marginBottom: 28 }}>
            Votre compte est créé avec succès. La connexion entre votre compte et l'application arrive très bientôt.
            <br/><br/>
            En attendant, vous pouvez explorer la démo complète pour voir toutes les fonctionnalités de Kōta.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={()=>window.location.href="/demo"} style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: K.gradient, color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}>
              Explorer la démo →
            </button>
            <button onClick={()=>window.location.href="/"} style={{
              padding: "14px 24px", borderRadius: 12, border: `1px solid ${K.border}`,
              background: "transparent", color: K.white,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}>
              Retour accueil
            </button>
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${K.border}`, fontSize: 13, color: K.grayLight }}>
            <strong style={{ color: K.green }}>● Bêta privée</strong> — Vous serez prévenu(e) par email dès que votre espace personnel sera prêt.
          </div>
        </div>
      </div>
    </div>
  );
}
