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
import {ProgressBar} from "../components/overlays/ProgressBar";
import {loadGoogleFont} from "../presets/fonts";

loadGoogleFont("Playfair Display");
loadGoogleFont("Montserrat");

// ─── Brand tokens ────────────────────────────────────────────────────
const BRAND = {
  verde: "#4A5240",
  beige: "#F0E8D8",
  dorado: "#C9A96E",
  negro: "#1A1A18",
  blanco: "#F5F2EC",
  marron: "#2E2A22",
};

// ─── Timing ──────────────────────────────────────────────────────────
const SPEED = 1.2;
const FPS = 30;
const s = (originalSeconds: number) =>
  Math.round((originalSeconds / SPEED) * FPS);

const VIDEO_DURATION_S = 163.5;
const VIDEO_FRAMES = s(VIDEO_DURATION_S); // ~4088 frames
const OUTRO_FRAMES = 150;
export const TOTAL_FRAMES = VIDEO_FRAMES + OUTRO_FRAMES;

// ─── Sections (original seconds) ─────────────────────────────────────
const SECTIONS = [
  {from: 0, to: 20, icon: "🧪", title: "ARQUETIPO #1", color: BRAND.verde},
  {from: 20, to: 42, icon: "🗺️", title: "HOJA DE RUTA", color: BRAND.dorado},
  {from: 42, to: 63, icon: "👑", title: "LA PERFECCIONISTA", color: BRAND.verde},
  {from: 63, to: 103, icon: "✨", title: "SUS FORTALEZAS", color: BRAND.dorado},
  {from: 103, to: 143, icon: "⚠️", title: "EL COSTO OCULTO", color: "#7A5C3A"},
  {from: 143, to: 164, icon: "🎯", title: "LA SOLUCIÓN", color: BRAND.verde},
];

// ─── Concept overlays (original seconds) ─────────────────────────────
const CONCEPT_CARDS = [
  {
    at: 55,
    dur: 8,
    icon: "🎯",
    text: "Excelencia\nmilimétrica",
    sub: "Todo bajo control, sin margen de error",
  },
  {
    at: 88,
    dur: 8,
    icon: "⭐",
    text: "Alta\nconfiabilidad",
    sub: "La primera elegida cuando hay que quedar bien",
  },
  {
    at: 118,
    dur: 8,
    icon: "🔍",
    text: "Ojo crítico\nbloqueante",
    sub: "Revisa todo una y otra vez",
  },
  {
    at: 150,
    dur: 8,
    icon: "🤝",
    text: "Autonomía\ndel equipo",
    sub: "Liderar sin hacer todo sola",
  },
];

// ─── B-roll images (original seconds) ────────────────────────────────
const BROLLS = [
  {
    at: 28,
    dur: 5,
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80",
  },
  {
    at: 78,
    dur: 5,
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1080&q=80",
  },
  {
    at: 133,
    dur: 5,
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&q=80",
  },
];

// ─── TopicBanner ──────────────────────────────────────────────────────
const TopicBanner: React.FC<{
  icon: string;
  title: string;
  color: string;
  durationFrames: number;
}> = ({icon, title, color, durationFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterProgress = spring({fps, frame, config: {damping: 16, stiffness: 140}});
  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    {extrapolateRight: "clamp"},
  );

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
          gap: 14,
          backgroundColor: "rgba(26,26,24,0.88)",
          backdropFilter: "blur(16px)",
          padding: "16px 38px",
          borderRadius: 60,
          borderLeft: `6px solid ${color}`,
          boxShadow: `0 4px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,169,110,0.15)`,
        }}
      >
        <span style={{fontSize: 34}}>{icon}</span>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: BRAND.blanco,
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};

// ─── ConceptCard ──────────────────────────────────────────────────────
const ConceptCard: React.FC<{
  icon: string;
  text: string;
  sub: string;
  durationFrames: number;
}> = ({icon, text, sub, durationFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterProgress = spring({fps, frame, config: {damping: 18, stiffness: 130}});
  const finalOpacity = interpolate(
    frame,
    [0, 10, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    {extrapolateRight: "clamp"},
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 145,
        left: 32,
        right: 32,
        display: "flex",
        justifyContent: "center",
        opacity: finalOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(26,26,24,0.92)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          padding: "34px 44px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          border: `1px solid rgba(201,169,110,0.25)`,
          boxShadow: "0 8px 48px rgba(0,0,0,0.65)",
          transform: `scale(${interpolate(enterProgress, [0, 1], [0.88, 1])})`,
          width: "100%",
        }}
      >
        <span style={{fontSize: 68}}>{icon}</span>
        <p
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: BRAND.blanco,
            fontFamily: "'Playfair Display', serif",
            textAlign: "center",
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </p>
        <div
          style={{
            width: 48,
            height: 2,
            backgroundColor: BRAND.dorado,
            borderRadius: 2,
          }}
        />
        <p
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: "rgba(245,242,236,0.68)",
            fontFamily: "'Montserrat', sans-serif",
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

// ─── B-Roll Overlay ───────────────────────────────────────────────────
const BRollOverlay: React.FC<{url: string; durationFrames: number}> = ({
  url,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});
  const fadeOut = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{opacity}}>
      <Img
        src={url}
        style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,26,24,0.5) 0%, rgba(26,26,24,0.3) 50%, rgba(26,26,24,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Outro Card ───────────────────────────────────────────────────────
const OutroCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fade = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});
  const titleY = spring({fps, frame: Math.max(0, frame - 10), config: {damping: 14, stiffness: 100}});
  const ctaY = spring({fps, frame: Math.max(0, frame - 25), config: {damping: 14, stiffness: 100}});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.negro,
        opacity: fade,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        padding: "80px 64px",
      }}
    >
      {/* Ornamental line */}
      <div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 48}}>
        <div style={{width: 60, height: 1, backgroundColor: BRAND.dorado, opacity: 0.6}} />
        <span style={{fontSize: 28, opacity: 0.8}}>🧪</span>
        <div style={{width: 60, height: 1, backgroundColor: BRAND.dorado, opacity: 0.6}} />
      </div>

      {/* Main message */}
      <p
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: BRAND.blanco,
          fontFamily: "'Playfair Display', serif",
          textAlign: "center",
          lineHeight: 1.2,
          margin: 0,
          marginBottom: 32,
          transform: `translateY(${interpolate(titleY, [0, 1], [40, 0])}px)`,
        }}
      >
        ¿Sos la Líder{"\n"}Perfeccionista?
      </p>

      {/* Divider */}
      <div style={{width: 64, height: 2, backgroundColor: BRAND.dorado, borderRadius: 2, marginBottom: 40}} />

      {/* CTA */}
      <div
        style={{
          backgroundColor: BRAND.verde,
          borderRadius: 60,
          padding: "22px 52px",
          transform: `translateY(${interpolate(ctaY, [0, 1], [40, 0])}px)`,
        }}
      >
        <p
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: BRAND.blanco,
            fontFamily: "'Montserrat', sans-serif",
            textAlign: "center",
            margin: 0,
            letterSpacing: 1,
          }}
        >
          Comentá TEST 👇
        </p>
      </div>

      <p
        style={{
          fontSize: 22,
          color: "rgba(245,242,236,0.55)",
          fontFamily: "'Montserrat', sans-serif",
          textAlign: "center",
          marginTop: 28,
          lineHeight: 1.5,
        }}
      >
        Descubrí tu arquetipo y tu hoja de ruta
      </p>

      {/* Firma */}
      <p
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 20,
          fontWeight: 300,
          color: "rgba(245,242,236,0.45)",
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: 2,
        }}
      >
        @antonella.cappanera
      </p>
    </AbsoluteFill>
  );
};

// ─── Watermark ────────────────────────────────────────────────────────
const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 52,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    <span
      style={{
        fontSize: 20,
        fontWeight: 300,
        color: `rgba(245,242,236,0.45)`,
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: 2,
      }}
    >
      @antonella.cappanera
    </span>
  </div>
);

// ─── Main Composition ─────────────────────────────────────────────────
export const Perfeccionista: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: BRAND.negro}}>
      {/* ─── VIDEO ──────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={VIDEO_FRAMES}>
        <VideoClip
          src={staticFile("assets/perfeccionista.mp4")}
          fit="cover"
          volume={0}
          playbackRate={SPEED}
        />
      </Sequence>

      {/* ─── AUDIO MEJORADO ─────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={VIDEO_FRAMES}>
        <Audio src={staticFile("assets/perf-audio.wav")} volume={1} />
      </Sequence>

      {/* ─── B-ROLLS ────────────────────────────────────────────── */}
      {BROLLS.map((br, i) => {
        const from = s(br.at);
        const dur = s(br.dur * SPEED);
        return (
          <Sequence key={`br-${i}`} from={from} durationInFrames={dur}>
            <BRollOverlay url={br.url} durationFrames={dur} />
          </Sequence>
        );
      })}

      {/* ─── SUBTÍTULOS (Montserrat SemiBold, zona pecho) ───────── */}
      <Sequence from={0} durationInFrames={VIDEO_FRAMES}>
        <CaptionOverlay
          captionsSource="captions-fast.json"
          preset="box"
          position="center"
          fontSize={80}
          fontFamily="'Montserrat', sans-serif"
          highlightColor={BRAND.dorado}
          textColor={BRAND.blanco}
          combineTokensWithinMs={1400}
          style={{
            top: "63%",
            transform: "none",
            left: 72,
            right: 72,
          }}
        />
      </Sequence>

      {/* ─── TOPIC BANNERS ──────────────────────────────────────── */}
      {SECTIONS.map((sec, i) => {
        const from = s(sec.from);
        const dur = s(sec.to - sec.from);
        return (
          <Sequence key={`sec-${i}`} from={from} durationInFrames={dur}>
            <TopicBanner
              icon={sec.icon}
              title={sec.title}
              color={sec.color}
              durationFrames={dur}
            />
          </Sequence>
        );
      })}

      {/* ─── CONCEPT CARDS ──────────────────────────────────────── */}
      {CONCEPT_CARDS.map((card, i) => {
        const from = s(card.at);
        const dur = s(card.dur * SPEED);
        return (
          <Sequence key={`card-${i}`} from={from} durationInFrames={dur}>
            <ConceptCard
              icon={card.icon}
              text={card.text}
              sub={card.sub}
              durationFrames={dur}
            />
          </Sequence>
        );
      })}

      {/* ─── WATERMARK ──────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={VIDEO_FRAMES}>
        <Watermark />
      </Sequence>

      {/* ─── OUTRO ──────────────────────────────────────────────── */}
      <Sequence from={VIDEO_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <OutroCard />
      </Sequence>

      {/* ─── PROGRESS BAR ───────────────────────────────────────── */}
      <ProgressBar color={BRAND.dorado} height={3} position="top" />
    </AbsoluteFill>
  );
};
