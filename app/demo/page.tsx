"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";

// ─── KŌTA DESIGN SYSTEM ────────────────────────────────────
const K = {
  dark: "#0a0e17", card: "#111827", border: "#1e293b", surface: "#0f1629",
  inputBg: "#1a2332", inputBorder: "#2a3a4e",
  white: "#f0f4f8", gray: "#94a3b8", grayLight: "#64748b", grayDark: "#334155",
  accent: "#3b82f6", accentLight: "#60a5fa", accentGlow: "#3b82f620",
  gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  green: "#10b981", orange: "#f59e0b", pink: "#ec4899", purple: "#8b5cf6",
  tagMO: "#f59e0b", tagFourn: "#3b82f6", tagDepl: "#10b981",
  stBrouillon: { bg: "#f59e0b18", t: "#f59e0b" }, stEnvoye: { bg: "#3b82f618", t: "#60a5fa" },
  stAccepte: { bg: "#10b98118", t: "#10b981" }, stRefuse: { bg: "#ef444418", t: "#ef4444" },
  error: "#ef4444",
};
const tagColor = (t) => t === "Main d'œuvre" ? K.tagMO : t === "Fourniture" ? K.tagFourn : K.tagDepl;
const statusSt = (s) => { const m = { brouillon: K.stBrouillon, "envoyé": K.stEnvoye, "accepté": K.stAccepte, "refusé": K.stRefuse }; const x = m[s]||m.brouillon; return { display:"inline-block",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:6,background:x.bg,color:x.t }; };
const fmt = (n) => new Intl.NumberFormat("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const fmtEur = (n) => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);
const uid = () => "id_"+Math.random().toString(36).substr(2,9);
const recalc = (lines,tva) => { const ht=lines.reduce((s,l)=>s+(l.quantity*l.unit_price||0),0); return {total_ht:ht,total_tva:ht*tva,total_ttc:ht*(1+tva)}; };
const Ic = ({d,size=20,color="currentColor",sw=2}) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>);
const ICONS = {send:"M22 2L11 13M22 2l-7 20-4-9-9-4z",mic:"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",chat:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",file:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",settings:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",check:"M20 6L9 17l-5-5",x:"M18 6L6 18M6 6l12 12",sparkle:"M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z",plus:"M12 5v14M5 12h14",edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",back:"M19 12H5M12 19l-7-7 7-7",download:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",stop:"M6 6h12v12H6z",droplet:"M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",arrow:"M5 12h14M12 5l7 7-7 7",camera:"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",link:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",share:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"};
const inputSt = {background:K.inputBg,border:`1px solid ${K.inputBorder}`,borderRadius:10,padding:"12px 14px",fontSize:14,color:K.white,outline:"none",width:"100%",fontFamily:"'Outfit',sans-serif"};

// ─── DATA ───────────────────────────────────────────────────
const DEF_PROFILE = {company_name:"Durand Plomberie",siret:"852 741 963 00018",address:"23 rue des Lilas, 06000 Nice",phone:"06 72 45 18 93",email:"contact@durand-plomberie.fr",forme_juridique:"EI",tva_intracom:"FR 32 852741963",rm_number:"852 741 963 RM 06",assurance_nom:"AXA France",assurance_numero:"POL-2024-78542",assurance_zone:"France entière",default_tva:0.1,hourly_rate:55,travel_fee:40,supply_margin:25,validite_devis:30,conditions_paiement:"30% à la commande, solde à réception des travaux"};
const DEF_PRESTAS = [
  {id:"p1",name:"Déplacement standard",price:40,unit:"forfait",type:"Déplacement"},
  {id:"p2",name:"Main d'œuvre (taux horaire)",price:55,unit:"h",type:"Main d'œuvre"},
  {id:"p3",name:"Débouchage canalisation",price:120,unit:"forfait",type:"Main d'œuvre"},
  {id:"p4",name:"Remplacement robinet",price:85,unit:"forfait",type:"Main d'œuvre"},
  {id:"p5",name:"Recherche de fuite",price:150,unit:"forfait",type:"Main d'œuvre"},
  {id:"p6",name:"Installation WC",price:250,unit:"forfait",type:"Main d'œuvre"},
  {id:"p7",name:"Pose chauffe-eau",price:300,unit:"forfait",type:"Main d'œuvre"},
];
const DEMO_DEVIS = [
  {id:"d1",devis_number:"KOT-2026-001",client_name:"M. Dupont",client_address:"12 rue de la Paix, Paris",client_phone:"06 98 76 54 32",client_email:"dupont@email.fr",description:"Remplacement chauffe-eau 200L",status:"accepté",total_ht:1250,total_tva:125,total_ttc:1375,tva_rate:0.1,created_at:"2026-04-05",lines:[
    {id:"l1",description:"Déplacement",type:"Déplacement",quantity:1,unit:"forfait",unit_price:40,total:40},
    {id:"l2",description:"Dépose ancien chauffe-eau",type:"Main d'œuvre",quantity:2,unit:"h",unit_price:55,total:110},
    {id:"l3",description:"Chauffe-eau Atlantic 200L",type:"Fourniture",quantity:1,unit:"unité",unit_price:750,total:750},
    {id:"l4",description:"Pose et raccordement",type:"Main d'œuvre",quantity:3,unit:"h",unit_price:55,total:165},
    {id:"l5",description:"Raccords",type:"Fourniture",quantity:1,unit:"forfait",unit_price:85,total:85},
    {id:"l6",description:"Mise en service",type:"Main d'œuvre",quantity:1,unit:"forfait",unit_price:100,total:100},
  ]},
  {id:"d2",devis_number:"KOT-2026-002",client_name:"Mme Bernard",client_address:"8 av Victor Hugo, Nice",client_phone:"06 11 22 33 44",client_email:"",description:"Fuite sous évier",status:"envoyé",total_ht:172,total_tva:17.2,total_ttc:189.2,tva_rate:0.1,created_at:"2026-04-08",lines:[
    {id:"l1",description:"Déplacement",type:"Déplacement",quantity:1,unit:"forfait",unit_price:40,total:40},
    {id:"l2",description:"Diagnostic fuite",type:"Main d'œuvre",quantity:1.5,unit:"h",unit_price:55,total:82.5},
    {id:"l3",description:"Siphon PVC",type:"Fourniture",quantity:1,unit:"forfait",unit_price:22,total:22},
    {id:"l4",description:"Remplacement",type:"Main d'œuvre",quantity:0.5,unit:"h",unit_price:55,total:27.5},
  ]},
];
const QUICK = [
  {icon:ICONS.droplet,label:"Fuite d'eau",prompt:"Fuite d'eau sous évier cuisine, diagnostic et réparation"},
  {icon:ICONS.zap,label:"Chauffe-eau",prompt:"Remplacement chauffe-eau 200L, dépose ancien, fourniture et pose"},
  {icon:ICONS.home,label:"WC / Sanitaires",prompt:"Installation WC suspendu, fourniture Grohe"},
  {icon:ICONS.camera,label:"Photo chantier",prompt:"__PHOTO_MODE__"},
];

// ─── BURST PARTICLES ────────────────────────────────────────
function BurstParticles({show}) {
  if (!show) return null;
  const particles = Array.from({length:24},(_,i)=>{
    const angle = (i/24)*360;
    const dist = 60+Math.random()*80;
    const rad = angle*(Math.PI/180);
    return {
      id:i, x:Math.cos(rad)*dist, y:Math.sin(rad)*dist,
      color:[K.accent,K.green,K.orange,K.pink,K.purple,"#fff"][Math.floor(Math.random()*6)],
      size:4+Math.random()*5, delay:Math.random()*0.15,
    };
  });
  return (
    <div style={{position:"absolute",top:"50%",left:"50%",pointerEvents:"none",zIndex:10}}>
      {particles.map(p=>(
        <div key={p.id} style={{
          position:"absolute",width:p.size,height:p.size,borderRadius:"50%",background:p.color,
          animation:`burst 0.7s cubic-bezier(0.16,1,0.3,1) ${p.delay}s forwards`,
          opacity:0,
          ["--tx"]:`${p.x}px`,["--ty"]:`${p.y}px`,
        }}/>
      ))}
    </div>
  );
}

// ─── SEND MODAL ─────────────────────────────────────────────
function SendModal({devis,profile,onClose,onSend}) {
  const [email,setEmail] = useState(devis.client_email||"");
  const [sent,setSent] = useState(false);

  const handleSend = () => { setSent(true); setTimeout(()=>{onSend(); onClose();},2500); };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:K.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:500,padding:24,border:`1px solid ${K.border}`,borderBottom:"none"}}>
        {sent ? (
          <div style={{textAlign:"center",padding:"20px 0",position:"relative"}}>
            <BurstParticles show={sent}/>
            <div style={{width:56,height:56,borderRadius:"50%",background:`${K.green}20`,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,animation:"popIn 0.4s cubic-bezier(0.16,1,0.3,1)"}}>
              <Ic d={ICONS.check} size={28} color={K.green}/>
            </div>
            <h3 style={{fontSize:18,fontWeight:700,marginBottom:8,animation:"popIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both"}}>Devis envoyé !</h3>
            <p style={{fontSize:14,color:K.gray,animation:"popIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.2s both"}}>
              Le PDF a été envoyé à {email}
            </p>
          </div>
        ) : (<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <h3 style={{fontSize:18,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
              <Ic d={ICONS.mail} size={20} color={K.accent}/> Envoyer le devis
            </h3>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic d={ICONS.x} size={20} color={K.grayLight}/></button>
          </div>

          {/* Recap */}
          <div style={{background:K.surface,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${K.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{devis.devis_number}</div>
                <div style={{fontSize:12,color:K.grayLight,marginTop:2}}>{devis.client_name} — {devis.description}</div>
              </div>
              <span style={{fontWeight:800,fontSize:16,color:K.accentLight}}>{fmtEur(devis.total_ttc)}</span>
            </div>
          </div>

          {/* Email */}
          <div style={{marginBottom:16}}>
            <label style={{fontSize:12,color:K.grayLight,display:"block",marginBottom:6}}>Email du client</label>
            <input style={inputSt} type="email" placeholder="client@email.fr" value={email} onChange={e=>setEmail(e.target.value)}/>
          </div>

          <p style={{fontSize:12,color:K.grayDark,marginBottom:16,lineHeight:1.6}}>
            Le client recevra un email avec le devis en PDF en pièce jointe. Vous pourrez changer le statut du devis manuellement quand il vous répond.
          </p>

          <button onClick={handleSend} disabled={!email.includes("@")} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:K.gradient,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${K.accent}30`,opacity:!email.includes("@")?0.5:1}}>
            <Ic d={ICONS.send} size={18} color="#fff"/> Envoyer par email
          </button>
        </>)}
      </div>
    </div>
  );
}

// ─── PHOTO MODE MODAL ───────────────────────────────────────
function PhotoModal({onClose,onResult}) {
  const [stage,setStage] = useState("capture"); // capture, analyzing, result
  const [result,setResult] = useState("");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    if (e.target.files?.[0]) {
      setStage("analyzing");
      // Simulate AI analysis
      setTimeout(()=>{
        const analyses = [
          "Je vois un chauffe-eau mural de type cumulus, probablement 150-200L. Traces de corrosion en bas — remplacement recommandé. Je te prépare un devis de remplacement avec dépose, fourniture Atlantic et pose.",
          "Photo d'un évier avec fuite visible au niveau du siphon. Joints usés, siphon PVC fissuré. Je te génère un devis diagnostic + remplacement siphon + joints.",
          "WC ancien modèle avec mécanisme de chasse défaillant. Je te propose un devis pour remplacement du mécanisme complet ou upgrade vers WC suspendu.",
        ];
        const r = analyses[Math.floor(Math.random()*analyses.length)];
        setResult(r); setStage("result");
      },2500);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:K.card,borderRadius:20,width:"100%",maxWidth:420,padding:24,border:`1px solid ${K.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontSize:18,fontWeight:700,display:"flex",alignItems:"center",gap:8}}>
            <Ic d={ICONS.camera} size={20} color={K.accent}/> Photo chantier
          </h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer"}}><Ic d={ICONS.x} size={20} color={K.grayLight}/></button>
        </div>

        {stage==="capture" && (<>
          <p style={{fontSize:14,color:K.gray,marginBottom:20,lineHeight:1.6}}>Prenez une photo du chantier. L'IA analysera l'image et pré-remplira votre devis automatiquement.</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{display:"none"}}/>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>fileRef.current?.click()} style={{flex:1,padding:14,borderRadius:12,border:"none",background:K.gradient,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Ic d={ICONS.camera} size={18} color="#fff"/> Prendre une photo
            </button>
            <button onClick={()=>{fileRef.current?.removeAttribute("capture"); fileRef.current?.click();}} style={{padding:"14px 18px",borderRadius:12,border:`1px solid ${K.border}`,background:"transparent",color:K.white,fontSize:14,cursor:"pointer"}}>
              Galerie
            </button>
          </div>
        </>)}

        {stage==="analyzing" && (
          <div style={{textAlign:"center",padding:"30px 0"}}>
            <div style={{width:64,height:64,borderRadius:16,background:K.accentGlow,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16,animation:"pulse 1.5s ease infinite"}}>
              <Ic d={ICONS.sparkle} size={28} color={K.accent}/>
            </div>
            <p style={{fontSize:16,fontWeight:600,marginBottom:8}}>Analyse en cours...</p>
            <p style={{fontSize:13,color:K.grayLight}}>L'IA examine votre photo</p>
            <div style={{height:4,background:K.dark,borderRadius:4,overflow:"hidden",maxWidth:200,margin:"16px auto 0"}}>
              <div style={{height:"100%",background:K.gradient,borderRadius:4,animation:"loading 2s ease infinite",width:"60%"}}/>
            </div>
          </div>
        )}

        {stage==="result" && (<>
          <div style={{background:K.surface,borderRadius:12,padding:16,marginBottom:16,border:`1px solid ${K.accent}20`}}>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <Ic d={ICONS.sparkle} size={16} color={K.accent}/>
              <span style={{fontSize:12,fontWeight:600,color:K.accent}}>Analyse IA</span>
            </div>
            <p style={{fontSize:14,color:K.gray,lineHeight:1.6}}>{result}</p>
          </div>
          <button onClick={()=>{onResult(result);onClose();}} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:K.gradient,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Ic d={ICONS.sparkle} size={18} color="#fff"/> Générer le devis
          </button>
        </>)}
      </div>
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────
export default function Kota() {
  const [onboarded,setOnboarded] = useState(false);
  const [obStep,setObStep] = useState(0);
  const [tab,setTab] = useState("home");
  const [prevTab,setPrevTab] = useState("home");
  const [profile,setProfile] = useState(DEF_PROFILE);
  const [prestas,setPrestas] = useState(DEF_PRESTAS);
  const [devisList,setDevisList] = useState(DEMO_DEVIS);
  const [editDevis,setEditDevis] = useState(null);
  const [sendModal,setSendModal] = useState(null);

  const [pdfDirect,setPdfDirect] = useState(false);
  const [tourActive,setTourActive] = useState(false);
  const [tourStep,setTourStep] = useState(0);

  // Tour se lance auto après onboarding si jamais fait (desktop uniquement)
  useEffect(()=>{
    if(onboarded){
      const done = typeof window!=="undefined" ? window.localStorage.getItem("kota_tour_done") : null;
      const isMobile = typeof window!=="undefined" && window.innerWidth < 769;
      if(!done && !isMobile){ setTimeout(()=>setTourActive(true), 800); }
    }
  },[onboarded]);

  const tourSteps = [
    { target: "sidebar-assistant", title: "Parlez à Kōta", desc: "Décrivez votre chantier en langage naturel, comme à un collègue. Kōta génère le devis en 30 secondes." },
    { target: "sidebar-devis", title: "Tous vos devis", desc: "Retrouvez l'historique complet, filtrable par statut (brouillon, envoyé, accepté)." },
    { target: "sidebar-stats", title: "Suivez votre activité", desc: "Devis en attente, acceptés, et CA total en direct sur votre tableau de bord." },
    { target: "sidebar-settings", title: "Personnalisez Kōta", desc: "Vos tarifs, vos prestations, votre logo. Tout est modifiable dans Réglages." },
  ];

  const nextTour = () => { if(tourStep<tourSteps.length-1) setTourStep(tourStep+1); else endTour(); };
  const endTour = () => {
    setTourActive(false);
    setTourStep(0);
    if(typeof window!=="undefined") window.localStorage.setItem("kota_tour_done","1");
  };
  const restartTour = () => {
    if(typeof window!=="undefined") window.localStorage.removeItem("kota_tour_done");
    setTourStep(0); setTourActive(true);
  };

  const openDevis = (d) => { setEditDevis(d); setPrevTab(tab); setTab("edit"); setPdfDirect(false); };
  const openDevisPdf = (d) => { setEditDevis(d); setPrevTab(tab); setTab("edit"); setPdfDirect(true); };
  const saveDevis = (d) => { const i=devisList.findIndex(x=>x.id===d.id); if(i>=0){const u=[...devisList];u[i]=d;setDevisList(u);}else setDevisList([...devisList,d]); setTab(prevTab); };
  const backFromEdit = () => setTab(prevTab);
  const markSent = (devisId) => { setDevisList(dl=>dl.map(d=>d.id===devisId?{...d,status:"envoyé"}:d)); };

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:K.dark,color:K.white,height:"100vh",display:"flex",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        @keyframes dotPulse{0%,80%,100%{opacity:.3}40%{opacity:1}}
        @keyframes burst{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
        @keyframes popIn{0%{transform:scale(0.3);opacity:0}100%{transform:scale(1);opacity:1}}
        @keyframes loading{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        .fade-up{animation:fadeUp .4s ease both}
        .msg-enter{animation:slideUp .3s ease both}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${K.border};border-radius:4px}
        input,textarea,select,button{font-family:'Outfit',sans-serif}
        .sidebar-btn{transition:all .15s ease}
        .sidebar-btn:hover{background:${K.surface} !important}
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-nav { display: flex !important; }
          .relance-modal { padding: 18px !important; border-radius: 14px !important; }
          .relance-channels button span, .relance-tones button span { font-size: 11px !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>

      {sendModal && <SendModal devis={sendModal} profile={profile} onClose={()=>setSendModal(null)} onSend={()=>{markSent(sendModal.id);}}/>}

      {!onboarded ? (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Onboarding profile={profile} setProfile={setProfile} step={obStep} setStep={setObStep} onComplete={()=>setOnboarded(true)}/>
        </div>
      ) : (<>
        {/* SIDEBAR */}
        <div className="desktop-sidebar" style={{width:240,flexShrink:0,background:K.card,borderRight:`1px solid ${K.border}`,display:"flex",flexDirection:"column",height:"100vh"}}>
          {/* Logo */}
          <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,background:K.gradient,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:900}}>K</div>
            <div>
              <div style={{fontWeight:700,fontSize:16}}>Kōta</div>
              <div style={{fontSize:11,color:K.green}}>● En ligne</div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{flex:1,padding:"8px 10px",display:"flex",flexDirection:"column",gap:2}}>
            {[
              {key:"home",icon:ICONS.sparkle,label:"Assistant",tourId:"sidebar-assistant"},
              {key:"devis",icon:ICONS.file,label:"Mes devis",tourId:"sidebar-devis"},
              {key:"settings",icon:ICONS.settings,label:"Réglages",tourId:"sidebar-settings"},
            ].map(t=>(
              <button key={t.key} data-tour={t.tourId} className="sidebar-btn" onClick={()=>setTab(t.key)} style={{
                display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                border:"none",borderRadius:10,cursor:"pointer",width:"100%",textAlign:"left",
                background:tab===t.key?K.surface:"transparent",
                color:tab===t.key?K.white:K.grayLight,
                fontSize:14,fontWeight:tab===t.key?600:400,
                position:"relative",zIndex:tourActive && tourSteps[tourStep].target===t.tourId ? 1001 : "auto",
              }}>
                <Ic d={t.icon} size={20} color={tab===t.key?K.accent:K.grayLight} sw={tab===t.key?2.2:1.5}/>
                {t.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div data-tour="sidebar-stats" style={{padding:"12px 14px",borderTop:`1px solid ${K.border}`,position:"relative",zIndex:tourActive && tourSteps[tourStep].target==="sidebar-stats"?1001:"auto"}}>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {[
                {l:"En attente",v:devisList.filter(d=>d.status==="envoyé"||d.status==="brouillon").length},
                {l:"Acceptés",v:devisList.filter(d=>d.status==="accepté").length},
              ].map(s=>(
                <div key={s.l} style={{flex:1,background:K.surface,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:800}}>{s.v}</div>
                  <div style={{fontSize:10,color:K.grayLight}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{background:K.surface,borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:18,fontWeight:800,color:K.green}}>{fmtEur(devisList.filter(d=>d.status==="accepté").reduce((s,d)=>s+d.total_ttc,0))}</div>
              <div style={{fontSize:10,color:K.grayLight}}>CA total</div>
            </div>
          </div>

          {/* Company info */}
          <div style={{padding:"14px",borderTop:`1px solid ${K.border}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:K.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>
              {profile.company_name.split(" ").map(n=>n[0]).join("").slice(0,2)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.company_name}</div>
              <div style={{fontSize:11,color:K.grayLight}}>{profile.forme_juridique}</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{flex:1,overflow:"hidden"}}>
            <div style={{display:tab==="home"?"flex":"none",flexDirection:"column",height:"100%"}}>
              <HomePage profile={profile} prestas={prestas} devisList={devisList} setDevisList={setDevisList} openDevis={openDevis} openDevisPdf={openDevisPdf} onSendDevis={d=>setSendModal(d)}/>
            </div>
            {tab==="devis" && <DevisListPage devisList={devisList} openDevis={openDevis} profile={profile} onCompta={()=>setTab("compta")}/>}
            {tab==="edit" && editDevis && <EditPage devis={editDevis} prestas={prestas} saveDevis={saveDevis} onBack={backFromEdit} profile={profile} onSend={d=>setSendModal(d)} pdfDirect={pdfDirect}/>}
            {tab==="compta" && <ComptaPage devisList={devisList} profile={profile} onBack={()=>setTab("devis")}/>}
            {tab==="settings" && <SettingsPage profile={profile} setProfile={setProfile} prestas={prestas} setPrestas={setPrestas}/>}
          </div>
          {/* Mobile bottom nav */}
          {tab!=="edit" && tab!=="compta" && (
            <nav className="mobile-nav" style={{display:"none",background:K.card,borderTop:`1px solid ${K.border}`,padding:"6px 0 env(safe-area-inset-bottom,6px)",flexShrink:0}}>
              {[{key:"home",icon:ICONS.sparkle,label:"Assistant"},{key:"devis",icon:ICONS.file,label:"Mes devis"},{key:"settings",icon:ICONS.settings,label:"Réglages"}].map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0",border:"none",background:"none",cursor:"pointer",color:tab===t.key?K.accent:K.grayLight}}>
                  <Ic d={t.icon} size={22} color={tab===t.key?K.accent:K.grayLight} sw={tab===t.key?2.2:1.5}/><span style={{fontSize:11,fontWeight:tab===t.key?600:400}}>{t.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </>)}

      {/* TOUR OVERLAY */}
      {tourActive && onboarded && (
        <TourOverlay
          step={tourSteps[tourStep]}
          stepIndex={tourStep}
          totalSteps={tourSteps.length}
          onNext={nextTour}
          onSkip={endTour}
        />
      )}
    </div>
  );
}

// ─── TOUR OVERLAY ─────────────────────────────────────────
function TourOverlay({step,stepIndex,totalSteps,onNext,onSkip}){
  const [pos,setPos] = useState(null);

  useEffect(()=>{
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if(el){
      const r = el.getBoundingClientRect();
      setPos({top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width,height:r.height});
    }
  },[step.target]);

  if(!pos) return null;

  // Tooltip position: right of the highlighted element
  const tooltipLeft = Math.min(pos.right + 20, window.innerWidth - 340);
  const tooltipTop = Math.max(16, Math.min(pos.top - 10, window.innerHeight - 280));

  const isLast = stepIndex === totalSteps - 1;

  return (
    <>
      <style>{`
        @keyframes kotaPulse {
          0%,100% { transform: scale(1); box-shadow: 0 0 0 0 ${K.accent}80, 0 0 30px ${K.accent}60; }
          50% { transform: scale(1.04); box-shadow: 0 0 0 14px ${K.accent}00, 0 0 50px ${K.accent}90; }
        }
        .kota-tour-pulse { animation: kotaPulse 1.6s ease-in-out infinite; border-radius: 10px; }
      `}</style>
      {/* Backdrop with cutout effect via 4 dark divs around the element */}
      <div onClick={onSkip} style={{position:"fixed",top:0,left:0,right:0,height:pos.top,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(2px)",zIndex:999}}/>
      <div onClick={onSkip} style={{position:"fixed",top:pos.bottom,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(2px)",zIndex:999}}/>
      <div onClick={onSkip} style={{position:"fixed",top:pos.top,left:0,width:pos.left,height:pos.height,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(2px)",zIndex:999}}/>
      <div onClick={onSkip} style={{position:"fixed",top:pos.top,left:pos.right,right:0,height:pos.height,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(2px)",zIndex:999}}/>

      {/* Pulse frame around element */}
      <div className="kota-tour-pulse" style={{
        position:"fixed",
        top:pos.top - 2,left:pos.left - 2,
        width:pos.width + 4,height:pos.height + 4,
        border:`2px solid ${K.accent}`,
        pointerEvents:"none",zIndex:1000,
      }}/>

      {/* Tooltip */}
      <div style={{
        position:"fixed",top:tooltipTop,left:tooltipLeft,width:300,zIndex:1002,
        background:"#0f172a",border:`1px solid ${K.accent}`,borderRadius:14,
        padding:20,boxShadow:`0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${K.accent}30`,
      }}>
        {/* Arrow pointing left */}
        <div style={{position:"absolute",left:-9,top:24,width:0,height:0,borderTop:"9px solid transparent",borderBottom:"9px solid transparent",borderRight:`9px solid ${K.accent}`}}/>
        <div style={{position:"absolute",left:-7,top:25,width:0,height:0,borderTop:"8px solid transparent",borderBottom:"8px solid transparent",borderRight:`8px solid #0f172a`}}/>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:11,color:K.accentLight,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>Étape {stepIndex+1} / {totalSteps}</div>
          <div style={{display:"flex",gap:4}}>
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} style={{width:20,height:3,background:i<=stepIndex?K.accent:"rgba(255,255,255,0.15)",borderRadius:2,transition:"background 0.3s"}}/>
            ))}
          </div>
        </div>

        <div style={{fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>{step.title}</div>
        <div style={{fontSize:13,color:K.gray,lineHeight:1.6,marginBottom:18}}>{step.desc}</div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={onSkip} style={{background:"transparent",border:"none",color:K.grayLight,fontSize:12,cursor:"pointer",fontWeight:500}}>Passer la visite</button>
          <button onClick={onNext} style={{background:K.gradient,color:"#fff",border:"none",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            {isLast ? "Terminer ✓" : "Suivant →"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── ONBOARDING ─────────────────────────────────────────────
function Onboarding({profile,setProfile,step,setStep,onComplete}) {
  const steps = [
    {title:"Bienvenue sur Kōta",subtitle:"Vos devis en 30 secondes.\nConfigurons votre profil.",fields:null},
    {title:"Votre entreprise",subtitle:"Ces infos apparaîtront sur chaque devis.",fields:[
      {label:"Nom de l'entreprise",field:"company_name",placeholder:"Martin Plomberie"},
      {label:"Forme juridique",field:"forme_juridique",type:"select",options:["EI","EURL","SARL","SAS","SASU","Auto-entrepreneur"]},
      {label:"SIRET",field:"siret",placeholder:"852 741 963 00018"},
      {label:"Adresse",field:"address",placeholder:"23 rue des Lilas, Nice"},
      {label:"Téléphone",field:"phone",placeholder:"06 72 45 18 93"},
      {label:"Email",field:"email",placeholder:"contact@durand-plomberie.fr"},
    ]},
    {title:"Assurance décennale",subtitle:"Obligatoire pour tout artisan BTP.",fields:[
      {label:"Assureur",field:"assurance_nom",placeholder:"AXA France"},
      {label:"N° police",field:"assurance_numero",placeholder:"POL-2024-78542"},
      {label:"Zone couverte",field:"assurance_zone",placeholder:"France entière"},
    ]},
    {title:"Vos tarifs",subtitle:"L'IA s'adapte à vos prix.",fields:[
      {label:"Taux horaire",field:"hourly_rate",type:"number",suffix:"€/h"},
      {label:"Déplacement",field:"travel_fee",type:"number",suffix:"€"},
      {label:"Marge fournitures",field:"supply_margin",type:"number",suffix:"%"},
    ]},
  ];
  const s=steps[step],isFirst=step===0,isLast=step===steps.length-1;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{display:"flex",gap:8,marginBottom:40}}>{steps.map((_,i)=>(<div key={i} style={{width:i===step?32:8,height:8,borderRadius:4,background:i<=step?K.accent:K.border,transition:"all .3s"}}/>))}</div>
      <div className="fade-up" key={step} style={{width:"100%",maxWidth:420}}>
        {isFirst&&<div style={{display:"flex",justifyContent:"center",marginBottom:32}}><div style={{width:72,height:72,background:K.gradient,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,fontWeight:900,boxShadow:`0 8px 32px ${K.accent}30`}}>K</div></div>}
        <h1 style={{fontSize:isFirst?28:22,fontWeight:800,textAlign:"center",marginBottom:8}}>{s.title}</h1>
        <p style={{fontSize:14,color:K.gray,textAlign:"center",marginBottom:28,lineHeight:1.6,whiteSpace:"pre-line"}}>{s.subtitle}</p>
        {s.fields&&<div style={{display:"flex",flexDirection:"column",gap:12,maxHeight:350,overflowY:"auto"}}>
          {s.fields.map(f=>(
            <div key={f.field}>
              <label style={{fontSize:12,color:K.gray,fontWeight:500,display:"block",marginBottom:5}}>{f.label}</label>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {f.type==="select"?<select style={{...inputSt,cursor:"pointer"}} value={profile[f.field]} onChange={e=>setProfile({...profile,[f.field]:e.target.value})}>{f.options.map(o=><option key={o}>{o}</option>)}</select>
                :<input type={f.type||"text"} style={{...inputSt,...(f.type==="number"?{width:110,textAlign:"right"}:{})}} placeholder={f.placeholder||""} value={profile[f.field]} onChange={e=>setProfile({...profile,[f.field]:f.type==="number"?(parseFloat(e.target.value)||0):e.target.value})}/>}
                {f.suffix&&<span style={{fontSize:13,color:K.grayLight}}>{f.suffix}</span>}
              </div>
            </div>
          ))}
        </div>}
        <div style={{display:"flex",gap:12,marginTop:28}}>
          {!isFirst&&<button onClick={()=>setStep(step-1)} style={{flex:1,padding:14,borderRadius:12,border:`1px solid ${K.border}`,background:"transparent",fontSize:15,fontWeight:500,cursor:"pointer",color:K.white}}>Retour</button>}
          <button onClick={()=>isLast?onComplete():setStep(step+1)} style={{flex:isFirst?1:2,padding:14,borderRadius:12,border:"none",background:K.gradient,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${K.accent}30`}}>
            {isFirst?"Commencer":isLast?"C'est parti !":"Continuer"} <Ic d={ICONS.arrow} size={18} color="#fff"/>
          </button>
        </div>
        {isFirst&&<button onClick={onComplete} style={{display:"block",width:"100%",marginTop:12,padding:12,background:"none",border:"none",color:K.grayLight,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Passer</button>}
      </div>
    </div>
  );
}

// ─── ANIMATED NUMBER ────────────────────────────────────────
function AnimNum({value,suffix="",duration=800}){
  const [display,setDisplay]=useState(0);
  const ref=useRef(null);const prev=useRef(0);
  useEffect(()=>{const start=prev.current;const end=value;const t0=Date.now();
    const step=()=>{const p=Math.min((Date.now()-t0)/duration,1);setDisplay(start+(end-start)*(1-Math.pow(1-p,3)));if(p<1)ref.current=requestAnimationFrame(step);};
    ref.current=requestAnimationFrame(step);prev.current=value;
    return()=>{if(ref.current)cancelAnimationFrame(ref.current);};
  },[value,duration]);
  return <>{fmt(display)}{suffix}</>;
}

// ─── HOME ───────────────────────────────────────────────────
function HomePage({profile,prestas,devisList,setDevisList,openDevis,openDevisPdf,onSendDevis}) {
  const firstName = profile.company_name.split(" ")[0];
  const lastDevis = devisList.length > 0 ? devisList[devisList.length-1] : null;
  const demoDevis = {id:"demo1",devis_number:"KOT-2026-003",client_name:"Mme Martin",client_address:"15 rue des Acacias, 06000 Nice",client_phone:"06 45 78 12 30",client_email:"",description:"Fuite sous évier, remplacement siphon",status:"brouillon",tva_rate:0.1,created_at:new Date().toISOString().slice(0,10),lines:[
    {id:"l1",description:"Déplacement",type:"Déplacement",quantity:1,unit:"forfait",unit_price:40,total:40},
    {id:"l2",description:"Diagnostic fuite",type:"Main d'œuvre",quantity:1,unit:"h",unit_price:55,total:55},
    {id:"l3",description:"Siphon PVC + joints",type:"Fourniture",quantity:1,unit:"forfait",unit_price:28,total:28},
    {id:"l4",description:"Remplacement siphon",type:"Main d'œuvre",quantity:0.5,unit:"h",unit_price:55,total:27.5},
  ],total_ht:150.5,total_tva:15.05,total_ttc:165.55};
  const [messages,setMessages] = useState([
    {id:"w",role:"ai",type:"text",content:`Salut ${firstName} ! Décris un chantier, envoie une photo, ou choisis un raccourci.`},
    {id:"u1",role:"user",type:"text",content:"Fuite sous évier chez Mme Martin au 15 rue des Acacias, faut changer le siphon"},
    {id:"a1",role:"ai",type:"text",content:"Fuite classique ! Siphon PVC à remplacer, je t'ajoute le diagnostic et les joints. Voilà ton devis :"},
    {id:"d1",role:"ai",type:"devis",devis:demoDevis},
  ]);
  const [input,setInput] = useState("");
  const [isListening,setIsListening] = useState(false);
  const [isGen,setIsGen] = useState(false);
  const [showSugg,setShowSugg] = useState(false);
  const [showPhoto,setShowPhoto] = useState(false);
  const scrollRef=useRef(null);
  const taRef=useRef(null);
  const recRef=useRef(null);

  const att=devisList.filter(d=>d.status==="envoyé"||d.status==="brouillon").length;
  const acc=devisList.filter(d=>d.status==="accepté").length;
  const ca=devisList.filter(d=>d.status==="accepté").reduce((s,d)=>s+d.total_ttc,0);

  useEffect(()=>{scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:"smooth"});},[messages]);

  const toggleVoice=()=>{
    if(isListening){recRef.current?.stop();setIsListening(false);return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert("Non supporté");return;}
    const r=new SR();r.lang="fr-FR";r.continuous=false;r.interimResults=true;
    r.onresult=e=>setInput(Array.from(e.results).map(r=>r[0].transcript).join(""));
    r.onend=()=>setIsListening(false);r.onerror=()=>setIsListening(false);
    recRef.current=r;r.start();setIsListening(true);
  };

  const sendMessage=async(text)=>{
    const msg=(text||input).trim();if(!msg||isGen)return;
    if(msg==="__PHOTO_MODE__"){setShowPhoto(true);return;}
    setInput("");setShowSugg(false);setIsGen(true);
    if(taRef.current)taRef.current.style.height="auto";
    setMessages(m=>[...m,{id:uid(),role:"user",type:"text",content:msg}]);
    const tid=uid();setMessages(m=>[...m,{id:tid,role:"ai",type:"thinking"}]);

    const history=messages.filter(m=>m.type==="text").slice(-8).map(m=>({role:m.role==="user"?"user":"assistant",content:m.content||""}));
    const pc=prestas.map(p=>`- ${p.name}: ${p.price}€/${p.unit} (${p.type})`).join("\n");
    const sys=`Tu es Kōta, assistant devis pour plombiers. Concis, pro, un peu de personnalité.\nTARIFS: ${profile.hourly_rate}€/h, déplacement ${profile.travel_fee}€, marge ${profile.supply_margin}%, TVA ${(profile.default_tva*100).toFixed(0)}%\nPRESTATIONS:\n${pc}\nQuand chantier décrit: confirme 1-2 phrases avec personnalité + JSON entre |||DEVIS_START||| et |||DEVIS_END|||:\n{"client_name":"...","client_address":"...","client_phone":"...","description":"...","lines":[{"id":"line_1","description":"...","type":"Main d'œuvre|Fourniture|Déplacement","quantity":1,"unit":"forfait|h|unité|m|m²|ml","unit_price":0,"total":0}]}\nDéplacement ${profile.travel_fee}€ en premier. Si pas un devis, réponds normalement avec personnalité.`;

    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...history,{role:"user",content:msg}]})});
      const data=await r.json();
      const aiText=data.content?.map(b=>b.text||"").join("")||"Désolé, erreur.";
      const dm=aiText.match(/\|\|\|DEVIS_START\|\|\|([\s\S]*?)\|\|\|DEVIS_END\|\|\|/);
      const clean=aiText.replace(/\|\|\|DEVIS_START\|\|\|[\s\S]*?\|\|\|DEVIS_END\|\|\|/,"").trim();
      setMessages(m=>m.filter(x=>x.id!==tid));
      if(clean)setMessages(m=>[...m,{id:uid(),role:"ai",type:"text",content:clean}]);
      if(dm){try{
        const dd=JSON.parse(dm[1].trim());
        const lines=dd.lines.map((l,i)=>({...l,id:`line_${i+1}`,total:l.quantity*l.unit_price}));
        const totals=recalc(lines,profile.default_tva);
        const nd={id:uid(),devis_number:`KOT-2026-${String(devisList.length+1).padStart(3,"0")}`,client_name:dd.client_name||"Client",client_address:dd.client_address||"",client_phone:dd.client_phone||"",client_email:"",description:dd.description||msg,status:"brouillon",tva_rate:profile.default_tva,created_at:new Date().toISOString().slice(0,10),lines,...totals};
        setTimeout(()=>setMessages(m=>[...m,{id:uid(),role:"ai",type:"devis",devis:nd}]),400);
        setDevisList(dl=>[...dl,nd]);
      }catch(e){console.error(e);}}
    }catch(e){console.error(e);setMessages(m=>m.filter(x=>x.id!==tid));setMessages(m=>[...m,{id:uid(),role:"ai",type:"text",content:"Erreur de connexion."}]);}
    finally{setIsGen(false);}
  };

  const handlePhotoResult=(analysis)=>{
    setShowSugg(false);
    setMessages(m=>[...m,{id:uid(),role:"user",type:"text",content:"📸 Photo du chantier envoyée"},{id:uid(),role:"ai",type:"text",content:analysis}]);
    // Auto-send the analysis as a devis request
    setTimeout(()=>sendMessage(analysis),500);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {showPhoto&&<PhotoModal onClose={()=>setShowPhoto(false)} onResult={handlePhotoResult}/>}
      {/* Clean header */}
      <div style={{flexShrink:0}}>
        <div style={{padding:"14px 20px",background:K.card,borderBottom:`1px solid ${K.border}`,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:K.gradient,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900}}>K</div>
          <div style={{flex:1}}>
            <span style={{fontWeight:700,fontSize:16}}>Kōta</span>
            <span style={{fontSize:12,color:K.green,marginLeft:10}}>● En ligne</span>
          </div>
        </div>
        {/* Refaire un similaire */}
        {lastDevis&&showSugg&&(
          <button onClick={()=>sendMessage(`Refais un devis similaire à celui de ${lastDevis.client_name} : ${lastDevis.description}`)} style={{
            width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 20px",
            background:K.card,borderBottom:`1px solid ${K.border}`,cursor:"pointer",textAlign:"left",border:"none",color:K.white,
          }}>
            <div style={{width:32,height:32,borderRadius:8,background:K.gradient,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ic d={ICONS.sparkle} size={14} color="#fff"/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:K.accentLight}}>Refaire un similaire</div>
              <div style={{fontSize:12,color:K.grayLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {lastDevis.description} — {lastDevis.client_name} — {fmtEur(lastDevis.total_ttc)}
              </div>
            </div>
            <Ic d={ICONS.arrow} size={14} color={K.grayLight}/>
          </button>
        )}
      </div>
      {/* Messages */}
      <div ref={scrollRef} style={{flex:1,overflow:"auto",padding:"12px 16px 8px"}}>
        {messages.map(m=>(
          <div key={m.id} className="msg-enter" style={{marginBottom:10}}>
            {m.type==="thinking"?<ThinkDots/>:m.type==="devis"?<DevisCard devis={m.devis} onOpen={()=>openDevis(m.devis)} profile={profile} onSend={()=>onSendDevis(m.devis)} onPreview={()=>openDevisPdf(m.devis)}/>:m.role==="user"?(
              <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:K.accent,color:"#fff",borderRadius:"16px 16px 4px 16px",padding:"11px 15px",maxWidth:"80%",fontSize:14,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.content}</div></div>
            ):(
              <div style={{display:"flex",gap:8}}><div style={{width:28,height:28,background:K.gradient,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,marginTop:2}}>K</div><div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:"16px 16px 16px 4px",padding:"11px 15px",maxWidth:"85%",fontSize:14,lineHeight:1.6,whiteSpace:"pre-wrap",color:K.gray}}>{m.content}</div></div>
            )}
          </div>
        ))}
        {showSugg&&messages.length<=2&&(
          <div style={{marginTop:8}}>
            <div style={{fontSize:12,color:K.grayLight,marginBottom:8,fontWeight:500}}>Suggestions</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {QUICK.map(s=>(<button key={s.label} onClick={()=>{if(s.prompt==="__PHOTO_MODE__")setShowPhoto(true);else sendMessage(s.prompt);}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:K.card,border:`1px solid ${K.border}`,borderRadius:12,cursor:"pointer",textAlign:"left",fontSize:13,color:K.white,fontWeight:500}}><div style={{width:32,height:32,borderRadius:8,background:K.accentGlow,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic d={s.icon} size={16} color={K.accent}/></div>{s.label}</button>))}
            </div>
          </div>
        )}
      </div>
      {/* Input */}
      <div style={{padding:"10px 16px 12px",background:K.card,borderTop:`1px solid ${K.border}`,display:"flex",gap:8,alignItems:"flex-end",flexShrink:0}}>
        <button onClick={toggleVoice} style={{width:42,height:42,borderRadius:11,border:"none",background:isListening?K.error:K.inputBg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,animation:isListening?"pulse 1.2s ease infinite":"none"}}>
          <Ic d={isListening?ICONS.stop:ICONS.mic} size={18} color={isListening?"#fff":K.grayLight}/>
        </button>
        <button onClick={()=>setShowPhoto(true)} style={{width:42,height:42,borderRadius:11,border:"none",background:K.inputBg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Ic d={ICONS.camera} size={18} color={K.grayLight}/>
        </button>
        <div style={{flex:1,background:K.inputBg,borderRadius:14,border:`1px solid ${K.inputBorder}`,display:"flex",alignItems:"flex-end",padding:"4px 4px 4px 14px"}}>
          <textarea ref={taRef} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder={isListening?"Écoute...":"Décris ton chantier..."} rows={1} style={{flex:1,border:"none",background:"transparent",fontSize:15,color:K.white,outline:"none",resize:"none",padding:"8px 0",lineHeight:1.4,maxHeight:120,fontFamily:"'Outfit',sans-serif"}}/>
          <button onClick={()=>sendMessage()} disabled={!input.trim()||isGen} style={{width:36,height:36,borderRadius:10,border:"none",background:input.trim()?K.gradient:K.border,cursor:input.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic d={ICONS.send} size={16} color="#fff"/></button>
        </div>
      </div>
    </div>
  );
}

function ThinkDots(){return(<div style={{display:"flex",gap:8}}><div style={{width:28,height:28,background:K.gradient,borderRadius:8,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,marginTop:2}}>K</div><div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:"16px 16px 16px 4px",padding:"14px 20px",display:"flex",gap:5,alignItems:"center"}}>{[0,1,2].map(i=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:K.accent,animation:`dotPulse 1.4s ease infinite`,animationDelay:`${i*.2}s`}}/>))}</div></div>);}

// ─── DEVIS CARD ─────────────────────────────────────────────
function DevisCard({devis:d,onOpen,profile,onSend,onPreview}) {
  return (
    <div style={{display:"flex",gap:8}}>
      <div style={{width:28,flexShrink:0}}/>
      <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:16,maxWidth:"92%",width:"100%",overflow:"hidden",boxShadow:"0 2px 16px rgba(0,0,0,0.2)"}}>
        {profile&&<div style={{padding:"8px 16px",borderBottom:`1px solid ${K.surface}`,fontSize:11,color:K.grayLight}}><span style={{fontWeight:600,color:K.gray}}>{profile.company_name}</span> — {profile.forme_juridique}</div>}
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${K.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:700,fontSize:14}}>{d.devis_number}</div><div style={{fontSize:12,color:K.grayLight,marginTop:2}}>{d.client_name} — {d.description}</div></div>
          <span style={statusSt(d.status)}>{d.status}</span>
        </div>
        <div style={{padding:"6px 16px"}}>
          {d.lines.slice(0,3).map(l=>(<div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${K.dark}`,fontSize:13}}><div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}><div style={{width:4,height:4,borderRadius:"50%",background:tagColor(l.type),flexShrink:0}}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:K.gray}}>{l.description}</span></div><span style={{fontWeight:600,flexShrink:0,marginLeft:12}}>{fmt(l.total)} €</span></div>))}
          {d.lines.length>3&&<div style={{fontSize:11,color:K.grayLight,padding:"4px 0"}}>+ {d.lines.length-3} lignes</div>}
        </div>
        <div style={{padding:"10px 16px",background:K.accentGlow,borderTop:`1px solid ${K.border}`,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800}}><span>Total TTC</span><span style={{color:K.accentLight}}>{fmt(d.total_ttc)} €</span></div>
        <div style={{padding:"8px 16px",display:"flex",flexDirection:"column",gap:6}}>
          <button onClick={onPreview} style={{width:"100%",padding:10,borderRadius:10,border:`1px solid ${K.accent}40`,background:`${K.accent}10`,color:K.accentLight,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Ic d={ICONS.file} size={14} color={K.accentLight}/> Aperçu PDF</button>
          <div style={{display:"flex",gap:6}}>
            <button onClick={onOpen} style={{flex:1,padding:9,borderRadius:10,border:`1px solid ${K.border}`,background:"transparent",color:K.white,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Ic d={ICONS.edit} size={14}/> Modifier</button>
            <button onClick={onSend} style={{flex:1,padding:9,borderRadius:10,border:"none",background:K.gradient,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Ic d={ICONS.send} size={14} color="#fff"/> Envoyer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DEVIS LIST ─────────────────────────────────────────────
function DevisListPage({devisList,openDevis,profile,onCompta}) {
  const [relanceDevis,setRelanceDevis] = useState(null);
  const att=devisList.filter(d=>d.status==="envoyé"||d.status==="brouillon").length;
  const acc=devisList.filter(d=>d.status==="accepté").length;
  const ca=devisList.filter(d=>d.status==="accepté").reduce((s,d)=>s+d.total_ttc,0);

  const daysSince = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / (1000*60*60*24));
    return diff;
  };

  return (
    <div style={{height:"100%",overflow:"auto"}}>
      {/* Stats header */}
      <div style={{padding:"16px 20px 14px",background:K.gradient}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h1 style={{fontSize:22,fontWeight:800}}>Mes devis</h1>
          <button onClick={onCompta} style={{padding:"8px 16px",borderRadius:8,border:"none",background:"rgba(255,255,255,.18)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <Ic d={ICONS.mail} size={14} color="#fff"/> Espace comptable
          </button>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:"En attente",v:att},{l:"Acceptés",v:acc},{l:"CA",v:fmtEur(ca)}].map(s=>(<div key={s.l} style={{flex:1,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:17,fontWeight:800}}>{s.v}</div><div style={{fontSize:10,opacity:.7,marginTop:2}}>{s.l}</div></div>))}
        </div>
      </div>
      <div style={{padding:"14px 20px 20px"}}>
        {/* Emetteur */}
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:K.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,flexShrink:0}}>K</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600}}>{profile.company_name}</div>
            <div style={{fontSize:12,color:K.grayLight}}>{profile.forme_juridique} — SIRET {profile.siret}</div>
          </div>
        </div>
        {devisList.map(d=>{
          const days = daysSince(d.created_at);
          const canRelance = d.status === "envoyé" && days >= 1;
          return (
            <div key={d.id} className="fade-up" style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
              <div onClick={()=>openDevis(d)} style={{cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontWeight:600,fontSize:15}}>{d.client_name}</div><div style={{fontSize:13,color:K.grayLight,marginTop:2}}>{d.description}</div></div><span style={statusSt(d.status)}>{d.status}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:12,color:K.grayLight}}>{d.devis_number} — {d.created_at}{canRelance && ` · ${days}j sans réponse`}</span><span style={{fontWeight:800,fontSize:16,color:K.accentLight}}>{fmtEur(d.total_ttc)}</span></div>
              </div>
              {canRelance && (
                <button onClick={(e)=>{e.stopPropagation();setRelanceDevis(d);}} style={{marginTop:12,width:"100%",padding:"9px 14px",borderRadius:10,border:`1px solid ${K.accent}`,background:`${K.accent}10`,color:K.accentLight,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <Ic d={ICONS.send} size={14} color={K.accentLight}/> Relancer
                </button>
              )}
            </div>
          );
        })}
      </div>
      {relanceDevis && <RelanceModal devis={relanceDevis} profile={profile} onClose={()=>setRelanceDevis(null)}/>}
    </div>
  );
}

// ─── RELANCE MODAL ─────────────────────────────────────────
function RelanceModal({devis,profile,onClose}){
  const [channel,setChannel] = useState("email");
  const [tone,setTone] = useState("pro");
  const [message,setMessage] = useState("");
  const [sent,setSent] = useState(false);

  const generateMessage = () => {
    const subject = `Relance — Devis ${devis.devis_number}`;
    const greeting = {
      pro: `Bonjour ${devis.client_name},`,
      friendly: `Bonjour ${devis.client_name} !`,
      firm: `Bonjour ${devis.client_name},`,
    }[tone];

    const body = {
      pro: `Je reviens vers vous concernant le devis ${devis.devis_number} pour "${devis.description}" que je vous ai envoyé le ${devis.created_at}.\n\nJe reste à votre disposition pour toute question ou ajustement. N'hésitez pas à me contacter pour en discuter.\n\nDans l'attente de votre retour,\n${profile.company_name}`,
      friendly: `J'espère que vous allez bien !\n\nJe reviens rapidement vers vous au sujet du devis ${devis.devis_number} pour "${devis.description}". Je voulais savoir si vous aviez pu y jeter un œil et si vous aviez des questions.\n\nN'hésitez pas à m'appeler si besoin, je suis là pour en parler.\n\nÀ très vite,\n${profile.company_name}`,
      firm: `Je fais suite à l'envoi du devis ${devis.devis_number} pour "${devis.description}" datant du ${devis.created_at}.\n\nSans retour de votre part sous 48h, je me permettrai de considérer que ce devis ne vous convient pas et de libérer le créneau prévu pour d'autres chantiers.\n\nRestant à votre disposition,\n${profile.company_name}`,
    }[tone];

    if(channel === "email"){
      return `Objet : ${subject}\n\n${greeting}\n\n${body}`;
    } else if(channel === "sms" || channel === "whatsapp"){
      // version courte pour SMS/WhatsApp
      const shortBody = {
        pro: `Bonjour ${devis.client_name}, je reviens vers vous pour le devis ${devis.devis_number}. Auriez-vous eu le temps de l'étudier ? Je reste disponible si vous avez des questions. ${profile.company_name}`,
        friendly: `Bonjour ${devis.client_name} ! Petit message pour savoir si vous avez pu regarder le devis ${devis.devis_number} que je vous ai envoyé. N'hésitez pas si questions ! ${profile.company_name}`,
        firm: `Bonjour ${devis.client_name}, sans retour sous 48h concernant le devis ${devis.devis_number}, je libérerai le créneau prévu. Merci de me confirmer votre décision. ${profile.company_name}`,
      }[tone];
      return shortBody;
    }
  };

  useEffect(()=>{
    setMessage(generateMessage());
  },[channel,tone]);

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    if(channel === "email"){
      const subject = encodeURIComponent(`Relance — Devis ${devis.devis_number}`);
      const body = encodeURIComponent(message.replace(/^Objet : .*\n\n/, ""));
      window.location.href = `mailto:${devis.client_email||""}?subject=${subject}&body=${body}`;
    } else if(channel === "sms"){
      window.location.href = `sms:${devis.client_phone||""}?body=${encoded}`;
    } else if(channel === "whatsapp"){
      const phone = (devis.client_phone||"").replace(/[^0-9]/g,"");
      window.open(`https://wa.me/${phone}?text=${encoded}`,"_blank");
    }
    setSent(true);
    setTimeout(onClose, 1500);
  };

  const channels = [
    {k:"email",l:"Email",icon:ICONS.mail},
    {k:"sms",l:"SMS",icon:ICONS.chat},
    {k:"whatsapp",l:"WhatsApp",icon:ICONS.send},
  ];
  const tones = [
    {k:"friendly",l:"Amical",emoji:"😊"},
    {k:"pro",l:"Pro",emoji:"👔"},
    {k:"firm",l:"Ferme",emoji:"⚡"},
  ];

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} className="relance-modal" style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:20,padding:28,maxWidth:560,width:"100%",maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:44,height:44,borderRadius:12,background:K.accentGlow,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic d={ICONS.send} size={22} color={K.accent}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:700}}>Relancer {devis.client_name}</div>
            <div style={{fontSize:13,color:K.grayLight}}>Devis {devis.devis_number} — {fmtEur(devis.total_ttc)}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
            <Ic d={ICONS.x} size={22} color={K.grayLight}/>
          </button>
        </div>

        {/* Canal */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,color:K.grayLight,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Canal</div>
          <div style={{display:"flex",gap:8}}>
            {channels.map(c=>(
              <button key={c.k} onClick={()=>setChannel(c.k)} style={{
                flex:1,padding:"10px",borderRadius:10,cursor:"pointer",
                border:`1px solid ${channel===c.k?K.accent:K.border}`,
                background:channel===c.k?`${K.accent}15`:"transparent",
                color:channel===c.k?K.white:K.gray,
                fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              }}>
                <Ic d={c.icon} size={14} color={channel===c.k?K.accent:K.gray}/> {c.l}
              </button>
            ))}
          </div>
        </div>

        {/* Ton */}
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:600,color:K.grayLight,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Ton du message</div>
          <div style={{display:"flex",gap:8}}>
            {tones.map(t=>(
              <button key={t.k} onClick={()=>setTone(t.k)} style={{
                flex:1,padding:"10px",borderRadius:10,cursor:"pointer",
                border:`1px solid ${tone===t.k?K.accent:K.border}`,
                background:tone===t.k?`${K.accent}15`:"transparent",
                color:tone===t.k?K.white:K.gray,
                fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              }}>
                <span style={{fontSize:16}}>{t.emoji}</span> {t.l}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:600,color:K.grayLight,textTransform:"uppercase",letterSpacing:"0.08em"}}>Message généré par l'IA</div>
            <button onClick={()=>setMessage(generateMessage())} style={{background:"none",border:"none",color:K.accentLight,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
              ↻ Régénérer
            </button>
          </div>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={channel==="email"?10:5} style={{
            width:"100%",padding:"14px",borderRadius:12,
            border:`1px solid ${K.border}`,background:K.inputBg,
            color:K.white,fontSize:13,fontFamily:"'Outfit',sans-serif",
            resize:"vertical",lineHeight:1.6,outline:"none",
          }}/>
        </div>

        {/* Actions */}
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:12,border:`1px solid ${K.border}`,background:"transparent",color:K.gray,fontSize:14,fontWeight:600,cursor:"pointer"}}>Annuler</button>
          <button onClick={handleSend} disabled={sent} style={{flex:2,padding:"12px",borderRadius:12,border:"none",background:sent?K.green:K.gradient,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {sent ? "✓ Envoyé" : <>Envoyer par {channels.find(c=>c.k===channel).l} →</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT PAGE ──────────────────────────────────────────────
function EditPage({devis,prestas,saveDevis,onBack,profile,onSend,pdfDirect}) {
  const [d,setD] = useState({...devis});
  const [editLine,setEditLine] = useState(null);
  const [showPdf,setShowPdf] = useState(pdfDirect||false);
  const [showStatus,setShowStatus] = useState(false);

  const updateLine=(id,f,v)=>{const nl=d.lines.map(l=>{if(l.id!==id)return l;const u={...l,[f]:v};if(f==="quantity"||f==="unit_price")u.total=(f==="quantity"?v:l.quantity)*(f==="unit_price"?v:l.unit_price);return u;});setD({...d,lines:nl,...recalc(nl,d.tva_rate)});};
  const delLine=id=>{const nl=d.lines.filter(l=>l.id!==id);setD({...d,lines:nl,...recalc(nl,d.tva_rate)});};
  const addEmpty=()=>{const nl={id:uid(),description:"",type:"Main d'œuvre",quantity:1,unit:"forfait",unit_price:0,total:0};setD({...d,lines:[...d.lines,nl]});setEditLine(nl.id);};
  const addPresta=p=>{const nl={id:uid(),description:p.name,type:p.type,quantity:1,unit:p.unit,unit_price:p.price,total:p.price};const lines=[...d.lines,nl];setD({...d,lines,...recalc(lines,d.tva_rate)});};
  const setTva=r=>setD({...d,tva_rate:r,...recalc(d.lines,r)});

  if(showPdf){
    const vd=new Date();vd.setDate(vd.getDate()+(profile.validite_devis||30));const validStr=vd.toLocaleDateString("fr-FR");
    return(
    <div id="pdf-view" style={{height:"100%",overflow:"auto",background:"#2a2a2e"}}>
      <style>{`@media print { #pdf-bar { display:none !important; } #pdf-view { background:#fff !important; } #pdf-page { box-shadow:none !important; border-radius:0 !important; max-width:100% !important; padding:32px !important; } }`}</style>
      <div id="pdf-bar" style={{padding:"12px 16px",background:K.card,borderBottom:`1px solid ${K.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button onClick={()=>{if(pdfDirect){onBack();}else{setShowPdf(false);}}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,color:K.white}}><Ic d={ICONS.back} size={18}/> Retour</button>
        <span style={{fontWeight:700,fontSize:14}}>Aperçu PDF</span>
        <button onClick={()=>window.print()} style={{background:K.gradient,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          <Ic d={ICONS.download} size={14} color="#fff"/> Télécharger
        </button>
      </div>
      <div style={{padding:20,display:"flex",justifyContent:"center"}}>
        <div id="pdf-page" style={{background:"#fff",width:"100%",maxWidth:680,padding:"48px 48px 40px",borderRadius:4,boxShadow:"0 4px 24px rgba(0,0,0,0.3)",fontSize:12,color:"#1a1a1a",lineHeight:1.6}}>

          {/* EN-TÊTE — Émetteur + DEVIS */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:28}}>
            <div>
              <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>{profile.company_name}</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>
                {profile.forme_juridique} — SIRET {profile.siret}<br/>
                {profile.rm_number && <>RM : {profile.rm_number}<br/></>}
                {profile.address}<br/>
                Tél : {profile.phone} — {profile.email}<br/>
                {profile.tva_intracom ? `TVA intracommunautaire : ${profile.tva_intracom}` : "TVA non applicable, art. 293 B du CGI"}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:28,fontWeight:900,marginBottom:4}}>DEVIS</div>
              <div style={{fontSize:11,color:"#666",lineHeight:1.7}}>
                N° {d.devis_number}<br/>
                Date : {d.created_at}<br/>
                Validité : {validStr}
              </div>
            </div>
          </div>

          {/* CLIENT */}
          <div style={{background:"#f5f5f0",borderRadius:8,padding:"14px 18px",marginBottom:8}}>
            <div style={{fontSize:9,fontWeight:600,textTransform:"uppercase",color:"#999",marginBottom:6}}>Client</div>
            <div style={{fontWeight:600}}>{d.client_name}</div>
            {d.client_address && <div style={{fontSize:11}}>{d.client_address}</div>}
            {d.client_phone && <div style={{fontSize:11}}>Tél : {d.client_phone}</div>}
          </div>

          {/* ADRESSE CHANTIER */}
          <div style={{background:"#f5f5f0",borderRadius:8,padding:"14px 18px",marginBottom:20}}>
            <div style={{fontSize:9,fontWeight:600,textTransform:"uppercase",color:"#999",marginBottom:6}}>Lieu d'exécution des travaux</div>
            <div style={{fontSize:11}}>{d.chantier_address || d.client_address || "Identique à l'adresse du client"}</div>
          </div>

          {/* DESCRIPTION + DURÉE */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>Objet : {d.description}</div>
            <div style={{fontSize:11,color:"#666"}}>Durée estimée des travaux : {d.duree_travaux || "À définir selon diagnostic"}</div>
          </div>

          {/* TABLEAU LIGNES */}
          <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20,fontSize:11}}>
            <thead><tr style={{borderBottom:"2px solid #e0e0e0"}}>
              {["Description","Type","Qté","Unité","Prix unit. HT","Total HT"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px 6px",fontSize:9,fontWeight:600,textTransform:"uppercase",color:"#999"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{d.lines.map(l=>(
              <tr key={l.id} style={{borderBottom:"1px solid #eee"}}>
                <td style={{padding:"8px 6px",fontWeight:500}}>{l.description}</td>
                <td style={{padding:"8px 6px",color:"#888",fontSize:10}}>{l.type}</td>
                <td style={{padding:"8px 6px"}}>{l.quantity}</td>
                <td style={{padding:"8px 6px"}}>{l.unit}</td>
                <td style={{padding:"8px 6px",textAlign:"right"}}>{fmt(l.unit_price)} €</td>
                <td style={{padding:"8px 6px",textAlign:"right",fontWeight:600}}>{fmt(l.total)} €</td>
              </tr>
            ))}</tbody>
          </table>

          {/* TOTAUX */}
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <div style={{width:240}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12}}><span>Total HT</span><span style={{fontWeight:500}}>{fmt(d.total_ht)} €</span></div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12}}><span>TVA ({(d.tva_rate*100).toFixed(0)}%)</span><span>{fmt(d.total_tva)} €</span></div>
              <div style={{borderTop:"2px solid #1a1a1a",marginTop:6,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800}}><span>Total TTC</span><span>{fmt(d.total_ttc)} €</span></div>
            </div>
          </div>

          {/* MENTIONS LÉGALES */}
          <div style={{fontSize:10,color:"#666",lineHeight:1.8,borderTop:"1px solid #ddd",paddingTop:14,marginBottom:14}}>
            <div style={{fontWeight:600,color:"#444",marginBottom:6,fontSize:11}}>Conditions et mentions légales</div>
            <div>Paiement : {profile.conditions_paiement}</div>
            <div>Durée de validité du devis : {profile.validite_devis || 30} jours à compter de la date d'émission</div>
            {d.tva_rate < 0.2 && <div>TVA à taux réduit ({(d.tva_rate*100).toFixed(1)}%) applicable conformément à l'article 279-0 bis du CGI pour les travaux d'amélioration, de transformation ou d'entretien portant sur un logement achevé depuis plus de 2 ans. Le client atteste que ces conditions sont remplies.</div>}
            {!profile.tva_intracom && <div>TVA non applicable, article 293 B du Code Général des Impôts</div>}
            <div>Ce devis est gratuit.</div>
            <div>Droit de rétractation : conformément à l'article L221-18 du Code de la consommation, le client dispose d'un délai de 14 jours pour exercer son droit de rétractation pour tout contrat conclu hors établissement.</div>
          </div>

          {/* ASSURANCE DÉCENNALE */}
          {profile.assurance_nom && (
            <div style={{fontSize:10,color:"#666",lineHeight:1.8,borderTop:"1px solid #ddd",paddingTop:12,marginBottom:14}}>
              <div style={{fontWeight:600,color:"#444",marginBottom:4,fontSize:11}}>Assurance décennale</div>
              <div>Assureur : {profile.assurance_nom}</div>
              <div>N° de police : {profile.assurance_numero}</div>
              <div>Couverture géographique : {profile.assurance_zone}</div>
            </div>
          )}

          {/* SIGNATURE */}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid #ddd"}}>
            <div style={{fontSize:10,color:"#666"}}>
              <div style={{fontWeight:600,color:"#444",marginBottom:8}}>L'entreprise</div>
              {profile.company_name}<br/>
              Date :<br/><br/>
              Signature :
            </div>
            <div style={{fontSize:10,color:"#666",textAlign:"right"}}>
              <div style={{fontWeight:600,color:"#444",marginBottom:8}}>Le client</div>
              Mention manuscrite :<br/>
              « Devis reçu avant l'exécution des travaux,<br/>
              lu et accepté, bon pour accord »<br/><br/>
              Date et signature :
              <br/><br/><br/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );}

  return (
    <div style={{height:"100%",overflow:"auto"}}>
      <div style={{padding:"12px 16px",background:K.gradient,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic d={ICONS.back} size={20} color="#fff"/></button>
        <div style={{flex:1}}><span style={{fontWeight:700}}>{d.devis_number}</span><span style={{opacity:.7,fontSize:13,marginLeft:8}}>{d.client_name}</span></div>
        <div style={{position:"relative"}}>
          <button onClick={()=>setShowStatus(!showStatus)} style={{...statusSt(d.status),background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",cursor:"pointer",fontSize:11,fontWeight:600,padding:"4px 12px",borderRadius:6}}>{d.status} ▾</button>
          {showStatus&&<div style={{position:"absolute",right:0,top:"100%",marginTop:6,background:K.card,border:`1px solid ${K.border}`,borderRadius:10,overflow:"hidden",zIndex:20,minWidth:130,boxShadow:"0 8px 24px rgba(0,0,0,0.3)"}}>
            {["brouillon","envoyé","accepté","refusé"].map(s=>(<button key={s} onClick={()=>{setD({...d,status:s});setShowStatus(false);}} style={{display:"block",width:"100%",padding:"10px 14px",border:"none",background:d.status===s?K.surface:"transparent",color:d.status===s?K.white:K.gray,fontSize:13,fontWeight:500,cursor:"pointer",textAlign:"left",borderBottom:`1px solid ${K.border}`}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:statusSt(s).color,marginRight:8}}/>{s}</button>))}
          </div>}
        </div>
      </div>
      <div style={{padding:16}}>
        <div style={{background:K.accentGlow,border:`1px solid ${K.accent}20`,borderRadius:14,padding:"10px 16px",marginBottom:12,fontSize:12,color:K.gray}}>
          <span style={{fontWeight:600,color:K.accentLight}}>{profile.company_name}</span> — {profile.forme_juridique} — SIRET {profile.siret}
        </div>
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontSize:11,color:K.grayLight,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>Client</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <input style={inputSt} placeholder="Nom" value={d.client_name} onChange={e=>setD({...d,client_name:e.target.value})}/>
            <input style={inputSt} placeholder="Téléphone" value={d.client_phone} onChange={e=>setD({...d,client_phone:e.target.value})}/>
            <input style={{...inputSt,gridColumn:"1/-1"}} placeholder="Adresse client" value={d.client_address} onChange={e=>setD({...d,client_address:e.target.value})}/>
            <input style={{...inputSt,gridColumn:"1/-1"}} placeholder="Email client" value={d.client_email||""} onChange={e=>setD({...d,client_email:e.target.value})}/>
          </div>
        </div>
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{fontSize:11,color:K.grayLight,fontWeight:600,textTransform:"uppercase",marginBottom:10}}>Chantier</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <input style={inputSt} placeholder="Adresse du chantier (si différente du client)" value={d.chantier_address||""} onChange={e=>setD({...d,chantier_address:e.target.value})}/>
            <input style={inputSt} placeholder="Durée estimée (ex: 2 heures, 1 journée)" value={d.duree_travaux||""} onChange={e=>setD({...d,duree_travaux:e.target.value})}/>
          </div>
        </div>
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"12px 16px",fontSize:11,color:K.grayLight,fontWeight:600,textTransform:"uppercase",borderBottom:`1px solid ${K.border}`}}>Lignes du devis</div>
          {d.lines.map(l=>{const isEd=editLine===l.id;return(
            <div key={l.id} style={{padding:"12px 16px",borderBottom:`1px solid ${K.dark}`}}>
              {isEd?(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <input style={inputSt} value={l.description} onChange={e=>updateLine(l.id,"description",e.target.value)}/>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <select style={{...inputSt,width:"auto"}} value={l.type} onChange={e=>updateLine(l.id,"type",e.target.value)}><option>Main d'œuvre</option><option>Fourniture</option><option>Déplacement</option></select>
                    <input type="number" step="0.5" style={{...inputSt,width:60}} value={l.quantity} onChange={e=>updateLine(l.id,"quantity",parseFloat(e.target.value)||0)}/>
                    <select style={{...inputSt,width:"auto"}} value={l.unit} onChange={e=>updateLine(l.id,"unit",e.target.value)}>{["forfait","h","unité","m","m²","ml"].map(u=><option key={u}>{u}</option>)}</select>
                    <input type="number" step="0.5" style={{...inputSt,width:80}} value={l.unit_price} onChange={e=>updateLine(l.id,"unit_price",parseFloat(e.target.value)||0)}/>
                  </div>
                  <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                    <button onClick={()=>setEditLine(null)} style={{background:K.green,color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>OK</button>
                    <button onClick={()=>delLine(l.id)} style={{background:"none",color:K.error,border:`1px solid ${K.error}30`,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer"}}>Supprimer</button>
                  </div>
                </div>
              ):(
                <div onClick={()=>setEditLine(l.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:500,marginBottom:3}}>{l.description||"Ligne vide"}</div><div style={{display:"flex",gap:8,alignItems:"center",fontSize:12,color:K.grayLight}}><span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:tagColor(l.type)+"20",color:tagColor(l.type)}}>{l.type}</span>{l.quantity} {l.unit} × {fmt(l.unit_price)}€</div></div>
                  <span style={{fontWeight:700,fontSize:15,flexShrink:0}}>{fmt(l.total)}€</span>
                </div>
              )}
            </div>
          );})}
          <div style={{padding:"10px 16px"}}><button onClick={addEmpty} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${K.border}`,background:"transparent",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:K.white}}><Ic d={ICONS.plus} size={14}/> Ligne</button></div>
        </div>
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:14,marginBottom:12}}>
          <div style={{fontSize:10,color:K.grayLight,fontWeight:600,textTransform:"uppercase",marginBottom:8}}>Raccourcis</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{prestas.slice(0,5).map(p=>(<button key={p.id} onClick={()=>addPresta(p)} style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${K.border}`,background:K.inputBg,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",color:K.gray}}>{p.name.length>18?p.name.slice(0,18)+"…":p.name}</button>))}</div>
        </div>
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:16,marginBottom:12}}>
          <div style={{display:"flex",gap:8,marginBottom:14}}><span style={{fontSize:13,color:K.grayLight,alignSelf:"center"}}>TVA:</span>{[0.1,0.2].map(r=>(<button key={r} onClick={()=>setTva(r)} style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${K.border}`,background:d.tva_rate===r?K.accent:"transparent",color:d.tva_rate===r?"#fff":K.white,fontSize:13,fontWeight:600,cursor:"pointer"}}>{(r*100).toFixed(0)}%</button>))}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end"}}>
            <div style={{display:"flex",gap:20,fontSize:14}}><span style={{color:K.grayLight}}>Total HT</span><span style={{fontWeight:500,minWidth:90,textAlign:"right"}}>{fmt(d.total_ht)}€</span></div>
            <div style={{display:"flex",gap:20,fontSize:14}}><span style={{color:K.grayLight}}>TVA</span><span style={{minWidth:90,textAlign:"right"}}>{fmt(d.total_tva)}€</span></div>
            <div style={{height:1,width:160,background:K.border,margin:"4px 0"}}/>
            <div style={{display:"flex",gap:20,fontSize:18}}><span style={{fontWeight:700}}>TTC</span><span style={{fontWeight:800,minWidth:90,textAlign:"right",color:K.accentLight}}>{fmt(d.total_ttc)}€</span></div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:24}}>
          <button onClick={()=>saveDevis(d)} style={{flex:1,padding:14,borderRadius:12,border:"none",background:K.gradient,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${K.accent}30`}}><Ic d={ICONS.check} size={18} color="#fff"/> Sauvegarder</button>
          <button onClick={()=>setShowPdf(true)} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${K.border}`,background:K.card,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:K.white}} title="Aperçu PDF"><Ic d={ICONS.file} size={16}/></button>
          <button onClick={()=>{setShowPdf(true);setTimeout(()=>window.print(),500);}} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${K.border}`,background:K.card,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:K.white}} title="Télécharger PDF"><Ic d={ICONS.download} size={16}/></button>
          <button onClick={()=>onSend(d)} style={{padding:"14px 16px",borderRadius:12,border:"none",background:K.green,cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#fff",fontWeight:600}} title="Envoyer"><Ic d={ICONS.send} size={16} color="#fff"/></button>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ───────────────────────────────────────────────
function SettingsPage({profile,setProfile,prestas,setPrestas}) {
  const [tab,setTab] = useState("profile");
  const [saved,setSaved] = useState(false);
  const [editId,setEditId] = useState(null);
  const [adding,setAdding] = useState(false);
  const [newP,setNewP] = useState({name:"",price:0,unit:"forfait",type:"Main d'œuvre"});
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};

  return (
    <div style={{height:"100%",overflow:"auto",padding:16}}>
      <h1 style={{fontSize:22,fontWeight:800,marginBottom:16}}>Réglages</h1>
      <div style={{display:"flex",gap:4,marginBottom:20,background:K.card,borderRadius:12,padding:4,border:`1px solid ${K.border}`}}>
        {[{k:"profile",l:"Entreprise"},{k:"tarifs",l:"Tarifs"},{k:"prestas",l:"Prestations"}].map(t=>(<button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:10,borderRadius:10,border:"none",background:tab===t.k?K.accent:"transparent",color:tab===t.k?"#fff":K.grayLight,fontSize:13,fontWeight:600,cursor:"pointer"}}>{t.l}</button>))}
      </div>

      {tab==="profile"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:20}}>
            <div style={{fontSize:11,color:K.accent,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Identité</div>
            {[{l:"Entreprise",f:"company_name"},{l:"SIRET",f:"siret"},{l:"Adresse",f:"address"},{l:"Téléphone",f:"phone"},{l:"Email",f:"email"}].map(({l,f})=>(<div key={f} style={{marginBottom:10}}><label style={{fontSize:11,color:K.grayLight,display:"block",marginBottom:4}}>{l}</label><input style={inputSt} value={profile[f]} onChange={e=>setProfile({...profile,[f]:e.target.value})}/></div>))}
          </div>
          <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:20}}>
            <div style={{fontSize:11,color:K.green,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Assurance décennale</div>
            {[{l:"Assureur",f:"assurance_nom"},{l:"N° police",f:"assurance_numero"},{l:"Zone",f:"assurance_zone"}].map(({l,f})=>(<div key={f} style={{marginBottom:10}}><label style={{fontSize:11,color:K.grayLight,display:"block",marginBottom:4}}>{l}</label><input style={inputSt} value={profile[f]} onChange={e=>setProfile({...profile,[f]:e.target.value})}/></div>))}
          </div>
          <button onClick={save} style={{padding:12,borderRadius:10,border:"none",background:saved?K.green:K.gradient,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>{saved?"Enregistré !":"Enregistrer"}</button>
        </div>
      )}
      {tab==="tarifs"&&(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{l:"Taux horaire",f:"hourly_rate",s:"€/h"},{l:"Déplacement",f:"travel_fee",s:"€"},{l:"Marge fournitures",f:"supply_margin",s:"%"}].map(({l,f,s})=>(<div key={f} style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600}}>{l}</span><div style={{display:"flex",alignItems:"center",gap:6}}><input type="number" style={{...inputSt,width:80,textAlign:"right",padding:10}} value={profile[f]} onChange={e=>setProfile({...profile,[f]:parseFloat(e.target.value)||0})}/><span style={{fontSize:13,color:K.grayLight}}>{s}</span></div></div>))}
          <button onClick={save} style={{padding:12,borderRadius:10,border:"none",background:saved?K.green:K.gradient,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>{saved?"Enregistré !":"Enregistrer"}</button>
        </div>
      )}
      {tab==="prestas"&&(
        <div>
          <button onClick={()=>setAdding(true)} style={{width:"100%",padding:12,borderRadius:12,border:`2px dashed ${K.border}`,background:"transparent",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:K.accent,marginBottom:12}}><Ic d={ICONS.plus} size={18} color={K.accent}/> Ajouter</button>
          {adding&&<div style={{background:K.accentGlow,border:`1px solid ${K.accent}30`,borderRadius:14,padding:16,marginBottom:12}}><input style={{...inputSt,marginBottom:8}} placeholder="Nom" value={newP.name} onChange={e=>setNewP({...newP,name:e.target.value})}/><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}><input type="number" style={{...inputSt,width:90,textAlign:"right"}} placeholder="Prix" value={newP.price||""} onChange={e=>setNewP({...newP,price:parseFloat(e.target.value)||0})}/><select style={{...inputSt,width:"auto"}} value={newP.unit} onChange={e=>setNewP({...newP,unit:e.target.value})}>{["forfait","h","unité","m","m²","ml"].map(u=><option key={u}>{u}</option>)}</select><select style={{...inputSt,width:"auto"}} value={newP.type} onChange={e=>setNewP({...newP,type:e.target.value})}><option>Main d'œuvre</option><option>Fourniture</option><option>Déplacement</option></select></div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>{setAdding(false);setNewP({name:"",price:0,unit:"forfait",type:"Main d'œuvre"});}} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${K.border}`,background:"transparent",fontSize:13,cursor:"pointer",color:K.white}}>Annuler</button><button onClick={()=>{if(!newP.name.trim())return;setPrestas([...prestas,{...newP,id:uid()}]);setNewP({name:"",price:0,unit:"forfait",type:"Main d'œuvre"});setAdding(false);}} style={{padding:"8px 20px",borderRadius:8,border:"none",background:K.accent,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Ajouter</button></div></div>}
          {prestas.map(p=>{const isEd=editId===p.id;return(
            <div key={p.id} style={{background:K.card,border:`1px solid ${isEd?K.accent+"40":K.border}`,borderRadius:12,padding:isEd?16:"12px 14px",marginBottom:8}}>
              {isEd?(<div style={{display:"flex",flexDirection:"column",gap:8}}><input style={inputSt} value={p.name} onChange={e=>setPrestas(prestas.map(x=>x.id===p.id?{...x,name:e.target.value}:x))}/><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input type="number" style={{...inputSt,width:90,textAlign:"right"}} value={p.price} onChange={e=>setPrestas(prestas.map(x=>x.id===p.id?{...x,price:parseFloat(e.target.value)||0}:x))}/><select style={{...inputSt,width:"auto"}} value={p.unit} onChange={e=>setPrestas(prestas.map(x=>x.id===p.id?{...x,unit:e.target.value}:x))}>{["forfait","h","unité","m","m²","ml"].map(u=><option key={u}>{u}</option>)}</select></div><div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><button onClick={()=>setPrestas(prestas.filter(x=>x.id!==p.id))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${K.error}30`,background:"transparent",fontSize:12,cursor:"pointer",color:K.error}}>Supprimer</button><button onClick={()=>setEditId(null)} style={{padding:"6px 20px",borderRadius:8,border:"none",background:K.green,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>OK</button></div></div>
              ):(<div onClick={()=>setEditId(p.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}><div><div style={{fontWeight:500,fontSize:14}}>{p.name}</div><span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:tagColor(p.type)+"20",color:tagColor(p.type)}}>{p.type}</span></div><span style={{fontWeight:700,color:K.accentLight}}>{p.price}€</span></div>)}
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

// ─── COMPTA PAGE ────────────────────────────────────────────
function ComptaPage({devisList,profile,onBack}){
  const [period,setPeriod]=useState("all");
  const [statusF,setStatusF]=useState("all");
  const [csvDone,setCsvDone]=useState(false);
  const [shareOpen,setShareOpen]=useState(false);
  const [copied,setCopied]=useState(false);
  const shareLink = typeof window !== "undefined" ? window.location.origin + "/compta" : "https://kota-site.vercel.app/compta";
  const periods=[{k:"all",l:"Tout"},{k:"2026-01",l:"Janvier"},{k:"2026-02",l:"Février"},{k:"2026-03",l:"Mars"},{k:"2026-04",l:"Avril"}];
  const statuses=[{k:"all",l:"Tous"},{k:"accepté",l:"Acceptés"},{k:"envoyé",l:"Envoyés"},{k:"brouillon",l:"Brouillons"}];
  const stColors={brouillon:{bg:"#f59e0b20",t:"#f59e0b"},"envoyé":{bg:"#3b82f620",t:"#60a5fa"},"accepté":{bg:"#10b98120",t:"#10b981"},"refusé":{bg:"#ef444420",t:"#ef4444"}};

  const filtered=devisList.filter(d=>{const mp=period==="all"||d.created_at.startsWith(period);const ms=statusF==="all"||d.status===statusF;return mp&&ms;});
  const totHt=filtered.reduce((s,d)=>s+d.total_ht,0);
  const totTva=filtered.reduce((s,d)=>s+d.total_tva,0);
  const totTtc=filtered.reduce((s,d)=>s+d.total_ttc,0);
  const accCount=filtered.filter(d=>d.status==="accepté").length;

  const dlCsv=()=>{
    const h="N° Devis;Date;Client;Description;HT;TVA;TTC;Statut\n";
    const rows=filtered.map(d=>`${d.devis_number};${d.created_at};${d.client_name};${d.description};${d.total_ht.toFixed(2)};${d.total_tva.toFixed(2)};${d.total_ttc.toFixed(2)};${d.status}`).join("\n");
    const blob=new Blob([h+rows],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`kota-export-${period==="all"?"complet":period}.csv`;a.click();URL.revokeObjectURL(url);
    setCsvDone(true);setTimeout(()=>setCsvDone(false),3000);
  };

  return(
    <div style={{height:"100%",overflow:"auto"}}>
      {/* Header */}
      <div style={{padding:"14px 20px",background:K.card,borderBottom:`1px solid ${K.border}`,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10,flexWrap:"wrap"}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Ic d={ICONS.back} size={20}/></button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:16}}>Espace comptable</div>
          <div style={{fontSize:12,color:K.grayLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.company_name} — Lecture seule</div>
        </div>
        <button onClick={()=>setShareOpen(true)} style={{padding:"8px 14px",borderRadius:10,border:"none",background:K.gradient,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
          <Ic d={ICONS.send} size={14} color="#fff"/> <span className="share-btn-text">Partager</span>
        </button>
      </div>

      {/* Share Modal */}
      {shareOpen && (
        <div onClick={()=>setShareOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:20,padding:32,maxWidth:520,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:44,height:44,borderRadius:12,background:K.accentGlow,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Ic d={ICONS.send} size={22} color={K.accent}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:700}}>Partager avec votre comptable</div>
                <div style={{fontSize:13,color:K.grayLight,marginTop:2}}>Accès direct, sans création de compte</div>
              </div>
              <button onClick={()=>setShareOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
                <Ic d={ICONS.x} size={22} color={K.grayLight}/>
              </button>
            </div>

            <div style={{padding:"16px 18px",background:K.surface,borderRadius:12,border:`1px solid ${K.border}`,marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:K.grayLight,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Lien sécurisé</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1,fontSize:14,fontFamily:"monospace",color:K.accentLight,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{shareLink}</div>
                <button onClick={()=>{navigator.clipboard.writeText(shareLink);setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{padding:"8px 14px",borderRadius:8,border:"none",background:copied?K.green:K.gradient,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
                  {copied ? <>✓ Copié !</> : <>📋 Copier</>}
                </button>
              </div>
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:K.white,marginBottom:10}}>Ce que votre comptable pourra faire :</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {["Consulter tous vos devis en lecture seule","Filtrer par période (mois, trimestre, année)","Exporter en CSV pour sa compta","Télécharger tous les PDF en un clic"].map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:K.gray}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:`${K.green}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={K.green} strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <div style={{padding:"12px 14px",background:`${K.accent}10`,border:`1px solid ${K.accent}30`,borderRadius:10,fontSize:12,color:K.gray,display:"flex",alignItems:"flex-start",gap:8}}>
              <span style={{fontSize:16,flexShrink:0}}>🔒</span>
              <span>Votre comptable n'a aucun droit de modification. Vous pouvez révoquer l'accès à tout moment depuis vos réglages.</span>
            </div>
          </div>
        </div>
      )}

      <div style={{padding:"16px 20px 24px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))",gap:12,marginBottom:20}}>
          {[{l:"Devis",v:filtered.length,c:K.accent},{l:"Total HT",v:fmtEur(totHt),c:K.white},{l:"TVA",v:fmtEur(totTva),c:K.orange},{l:"Total TTC",v:fmtEur(totTtc),c:K.green}].map(s=>(
            <div key={s.l} style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,padding:"14px 16px"}}>
              <div style={{fontSize:11,color:K.grayLight,fontWeight:500,marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filters + actions */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <select value={period} onChange={e=>setPeriod(e.target.value)} style={{padding:"10px 16px",borderRadius:10,border:`1px solid ${K.border}`,background:K.card,fontSize:13,fontWeight:500,color:K.white,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
              {periods.map(p=><option key={p.k} value={p.k}>{p.l}</option>)}
            </select>
            <div style={{display:"flex",gap:3,background:K.surface,borderRadius:10,padding:3}}>
              {statuses.map(s=>(<button key={s.k} onClick={()=>setStatusF(s.k)} style={{padding:"7px 14px",borderRadius:8,border:"none",background:statusF===s.k?K.accent:"transparent",color:statusF===s.k?"#fff":K.grayLight,fontSize:12,fontWeight:600,cursor:"pointer"}}>{s.l}</button>))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={dlCsv} style={{padding:"10px 20px",borderRadius:10,border:"none",background:csvDone?K.green:K.gradient,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Ic d={ICONS.download} size={14} color="#fff"/> {csvDone?"Téléchargé !":"Export CSV"}
            </button>
            <button style={{padding:"10px 20px",borderRadius:10,border:`1px solid ${K.border}`,background:K.card,color:K.white,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <Ic d={ICONS.download} size={14}/> Tous les PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{background:K.card,border:`1px solid ${K.border}`,borderRadius:14,overflow:"auto",maxWidth:"100%"}}>
          <table style={{width:"100%",minWidth:700,borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`2px solid ${K.border}`}}>
              {["N° Devis","Date","Client","Description","HT","TVA","TTC","Statut"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"12px 14px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",color:K.grayLight,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(d=>{const sc=stColors[d.status]||stColors.brouillon;return(
                <tr key={d.id} style={{borderBottom:`1px solid ${K.border}`,transition:"background .15s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=K.surface} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"12px 14px",fontWeight:600,color:K.accentLight,whiteSpace:"nowrap"}}>{d.devis_number}</td>
                  <td style={{padding:"12px 14px",color:K.grayLight,whiteSpace:"nowrap"}}>{d.created_at}</td>
                  <td style={{padding:"12px 14px",fontWeight:500}}>{d.client_name}</td>
                  <td style={{padding:"12px 14px",color:K.grayLight,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.description}</td>
                  <td style={{padding:"12px 14px",textAlign:"right",fontWeight:500,whiteSpace:"nowrap"}}>{fmt(d.total_ht)} €</td>
                  <td style={{padding:"12px 14px",textAlign:"right",color:K.orange,whiteSpace:"nowrap"}}>{fmt(d.total_tva)} €</td>
                  <td style={{padding:"12px 14px",textAlign:"right",fontWeight:700,whiteSpace:"nowrap"}}>{fmt(d.total_ttc)} €</td>
                  <td style={{padding:"12px 14px"}}><span style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:6,background:sc.bg,color:sc.t}}>{d.status}</span></td>
                </tr>
              );})}
            </tbody>
            <tfoot><tr style={{borderTop:`2px solid ${K.border}`,background:K.surface}}>
              <td colSpan={4} style={{padding:"12px 14px",fontWeight:700}}>{filtered.length} devis · {accCount} acceptés</td>
              <td style={{padding:"12px 14px",textAlign:"right",fontWeight:700}}>{fmt(totHt)} €</td>
              <td style={{padding:"12px 14px",textAlign:"right",fontWeight:600,color:K.orange}}>{fmt(totTva)} €</td>
              <td style={{padding:"12px 14px",textAlign:"right",fontWeight:800,color:K.green}}>{fmt(totTtc)} €</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>

        {/* Footer */}
        <div style={{marginTop:16,padding:"12px 16px",background:K.card,border:`1px solid ${K.border}`,borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:K.grayLight}}><strong style={{color:K.gray}}>{profile.company_name}</strong> — {profile.forme_juridique} — SIRET {profile.siret}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:20,height:20,borderRadius:6,background:K.gradient,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#fff"}}>K</div>
            <span style={{fontSize:11,color:K.grayLight}}>Propulsé par <strong style={{color:K.accent}}>Kōta</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
