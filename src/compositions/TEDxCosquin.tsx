import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {VideoClip} from "../components/media/VideoClip";
import {CaptionOverlay} from "../components/text/CaptionOverlay";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {loadGoogleFont} from "../presets/fonts";

// ─── Timings at 1.2x speed (original seconds / 1.2) ─────────────────
const FPS = 30;
const SPEED = 1.2;
const s = (originalSeconds: number) => Math.round((originalSeconds / SPEED) * FPS);

// Section boundaries (in original seconds, auto-converted)
const SECTIONS = [
  {start: 0, end: 25, title: "NUESTRO CEREBRO VS. EL MUNDO", icon: "🧠", color: "#E62B1E"},
  {start: 25, end: 50, title: "¿DECISIONES RACIONALES?", icon: "⚖️", color: "#FF6B35"},
  {start: 50, end: 73, title: "LOS PATRONES DE SUPERVIVENCIA", icon: "⚡", color: "#FFD700"},
  {start: 73, end: 100, title: "OBSERVARNOS EN TIEMPO REAL", icon: "👁️", color: "#00D4AA"},
  {start: 100, end: 133, title: "LA IA AMPLIFICA LO QUE SOMOS", icon: "🤖", color: "#6366F1"},
  {start: 133, end: 169, title: "LA VERDADERA VENTAJA COMPETITIVA", icon: "🏆", color: "#E62B1E"},
  {start: 169, end: 201, title: "VOLVER AL ORIGEN", icon: "🌱", color: "#00D4AA"},
];

// ─── B-Roll stock images (in original seconds) ──────────────────────
const BROLL_OVERLAYS = [
  {
    at: 55,
    dur: 5,
    url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1080&q=80",
    credit: "Unsplash – Brain/Neurons",
  },
  {
    at: 108,
    dur: 5,
    url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1080&q=80",
    credit: "Unsplash – Artificial Intelligence",
  },
  {
    at: 145,
    dur: 5,
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1080&q=80",
    credit: "Unsplash – Leadership/Team",
  },
];

// Concept image overlay moments (in original seconds)
const IMAGE_OVERLAYS = [
  {at: 6, dur: 4, text: "Actualización cada\n6 meses", icon: "🌍", sub: "El mundo cambia más rápido que nuestro cerebro"},
  {at: 15, dur: 4, text: "Sistema operativo\nde 300.000 años", icon: "🧬", sub: "Decisiones del 2026 con software prehistórico"},
  {at: 40, dur: 4, text: "Neurociencia", icon: "🔬", sub: "Demuestra que no decidimos racionalmente"},
  {at: 55, dur: 4, text: "Miedo · Escasez\nPertenencia", icon: "😰", sub: "Los patrones de fondo que nos gobiernan"},
  {at: 78, dur: 4, text: "Observarnos\nen tiempo real", icon: "🪞", sub: "La capacidad que todos tenemos"},
  {at: 95, dur: 4, text: "Responder\nvs. Reaccionar", icon: "🎯", sub: "Elegir en vez de operar en piloto automático"},
  {at: 108, dur: 4, text: "IA + Claridad\n= Potencia", icon: "⚡", sub: "La IA amplifica lo que tenemos dentro"},
  {at: 125, dur: 4, text: "IA + Caos\n= Más caos", icon: "🌀", sub: "Sin autoconocimiento, la tecnología no alcanza"},
  {at: 145, dur: 4, text: "Autoconocimiento\n= Ventaja competitiva", icon: "💎", sub: "La verdadera tecnología de liderazgo"},
  {at: 172, dur: 4, text: "Volver a\nnuestra biología", icon: "🌱", sub: "Para conocernos y entendernos"},
];

// ─── Topic Headline Banner ───────────────────────────────────────────
const TopicBanner: React.FC<{title: string; icon: string; color: string}> = ({
  title,
  icon,
  color,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterProgress = spring({fps, frame, config: {damping: 18, stiffness: 120}});
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${interpolate(enterProgress, [0, 1], [-28, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          backgroundColor: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(14px)",
          padding: "18px 40px",
          borderRadius: 60,
          borderLeft: `6px solid ${color}`,
          boxShadow: `0 4px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)`,
        }}
      >
        <span style={{fontSize: 36}}>{icon}</span>
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: 1.8,
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

// ─── Concept Card Overlay ────────────────────────────────────────────
const ConceptCard: React.FC<{
  text: string;
  icon: string;
  sub: string;
}> = ({text, icon, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterProgress = spring({fps, frame, config: {damping: 14, stiffness: 100}});
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});

  // Exit fade
  const totalFrames = 4 * FPS / SPEED; // 4 original seconds
  const exitOpacity = interpolate(frame, [totalFrames - 15, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalOpacity = Math.min(opacity, exitOpacity);

  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 32,
        right: 32,
        display: "flex",
        justifyContent: "center",
        opacity: finalOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "36px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.7)",
          transform: `scale(${interpolate(enterProgress, [0, 1], [0.88, 1])})`,
          width: "100%",
        }}
      >
        <span style={{fontSize: 72}}>{icon}</span>
        <p
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: "pre-line",
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </p>
        <p
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Inter', sans-serif",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
};

// ─── B-Roll Image Overlay ────────────────────────────────────────────
const BRollOverlay: React.FC<{url: string; durationFrames: number}> = ({
  url,
  durationFrames,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [durationFrames - 12, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{opacity}}>
      <Img
        src={url}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Dark gradient so subtitles remain readable */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Intro Card ─────────────────────────────────────────────────────
const IntroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({fps, frame, config: {damping: 14, stiffness: 80}});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#1a0808", "#0a0a1a"]} angle={135} />
      <ParticleField count={20} color="rgba(230,43,30,0.08)" speed={0.3} direction="up" />
      <AbsoluteFill
        style={{justifyContent: "center", alignItems: "center", padding: "0 70px", opacity}}
      >
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 24}}>
          <div
            style={{
              backgroundColor: "#E62B1E",
              padding: "10px 24px",
              borderRadius: 4,
              transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 3,
              }}
            >
              TEDx COSQUÍN
            </span>
          </div>
          <div
            style={{
              width: interpolate(progress, [0, 1], [0, 120]),
              height: 3,
              backgroundColor: "#E62B1E",
              borderRadius: 2,
            }}
          />
          <h1
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
              lineHeight: 1.2,
              margin: 0,
              transform: `translateY(${interpolate(progress, [0, 1], [25, 0])}px)`,
            }}
          >
            El autoconocimiento como tecnología de liderazgo
          </h1>
          <p
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
              margin: 0,
              opacity: interpolate(frame, [20, 40], [0, 1], {extrapolateRight: "clamp"}),
            }}
          >
            Antonella Cappanera
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Outro Card ─────────────────────────────────────────────────────
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({fps, frame, config: {damping: 14, stiffness: 80}});
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0a0a0a", "#0a0a1a", "#1a0808"]} angle={200} />
      <ParticleField count={15} color="rgba(230,43,30,0.06)" speed={0.2} direction="up" />
      <AbsoluteFill
        style={{justifyContent: "center", alignItems: "center", padding: "0 70px", opacity}}
      >
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 20}}>
          <span style={{fontSize: 64}}>🌱</span>
          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
              lineHeight: 1.3,
              margin: 0,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
            }}
          >
            Antonella Cappanera
          </h1>
          <div
            style={{
              backgroundColor: "#E62B1E",
              padding: "8px 20px",
              borderRadius: 4,
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 2,
              }}
            >
              TEDx COSQUÍN
            </span>
          </div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Inter', sans-serif",
              textAlign: "center",
              margin: 0,
              opacity: interpolate(frame, [15, 35], [0, 1], {extrapolateRight: "clamp"}),
            }}
          >
            #Autoconocimiento #Liderazgo #IA
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// Intro (3s) + Video at 1.2x (~168s) + Outro (4s) ≈ 175s = 5250 frames
// ═══════════════════════════════════════════════════════════════════════
const INTRO_FRAMES = 90; // 3s
const VIDEO_FRAMES = s(201.68); // full video at 1.2x ≈ 5042 frames
const OUTRO_FRAMES = 120; // 4s

export const TEDxCosquin: React.FC = () => {
  loadGoogleFont("Playfair Display");
  loadGoogleFont("Inter");

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      {/* ─── INTRO CARD ─────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <IntroCard />
      </Sequence>

      {/* ─── MAIN VIDEO at 1.2x ─────────────────────────────── */}
      <Sequence from={INTRO_FRAMES} durationInFrames={VIDEO_FRAMES}>
        <VideoClip
          src={staticFile("assets/tedx-cosquin.mp4")}
          playbackRate={SPEED}
          fit="cover"
          muted
        />
      </Sequence>

      {/* ─── ENHANCED AUDIO (pre-processed at 1.2x) ──────────── */}
      <Sequence from={INTRO_FRAMES} durationInFrames={VIDEO_FRAMES}>
        <Audio src={staticFile("assets/tedx-audio-enhanced.wav")} volume={1} />
      </Sequence>

      {/* ─── B-ROLL STOCK IMAGES ─────────────────────────────── */}
      {BROLL_OVERLAYS.map((broll, i) => {
        const from = INTRO_FRAMES + s(broll.at);
        const duration = s(broll.dur * SPEED);
        return (
          <Sequence key={`broll-${i}`} from={from} durationInFrames={duration}>
            <BRollOverlay url={broll.url} durationFrames={duration} />
          </Sequence>
        );
      })}

      {/* ─── SUBTITLES — Viral Instagram style ───────────────── */}
      {/* Positioned at chest/throat area (~62% from top), safe margins 80px each side */}
      <Sequence from={INTRO_FRAMES} durationInFrames={VIDEO_FRAMES}>
        <CaptionOverlay
          captionsSource="captions-fast.json"
          preset="outline"
          position="center"
          fontSize={84}
          fontFamily="'Inter', sans-serif"
          highlightColor="#FFD700"
          textColor="#ffffff"
          combineTokensWithinMs={1400}
          style={{
            top: "62%",
            transform: "none",
            left: 80,
            right: 80,
          }}
        />
      </Sequence>

      {/* ─── TOPIC HEADLINES (top of screen) ──────────────────── */}
      {SECTIONS.map((section, i) => {
        const from = INTRO_FRAMES + s(section.start);
        const duration = s(section.end) - s(section.start);
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <TopicBanner
              title={section.title}
              icon={section.icon}
              color={section.color}
            />
          </Sequence>
        );
      })}

      {/* ─── CONCEPT IMAGE OVERLAYS ───────────────────────────── */}
      {IMAGE_OVERLAYS.map((overlay, i) => {
        const from = INTRO_FRAMES + s(overlay.at);
        const duration = s(overlay.dur * SPEED); // dur is already in original seconds
        return (
          <Sequence key={`img-${i}`} from={from} durationInFrames={duration}>
            <ConceptCard
              text={overlay.text}
              icon={overlay.icon}
              sub={overlay.sub}
            />
          </Sequence>
        );
      })}

      {/* ─── OUTRO CARD ─────────────────────────────────────── */}
      <Sequence from={INTRO_FRAMES + VIDEO_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <OutroCard />
      </Sequence>

      {/* ─── PROGRESS BAR ────────────────────────────────────── */}
      <ProgressBar color="#E62B1E" height={3} position="bottom" />
    </AbsoluteFill>
  );
};
