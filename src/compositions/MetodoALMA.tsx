import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {loadGoogleFont} from "../presets/fonts";

// ─── Animated text line (enter + hold + exit) ───────────────────────────
const TextLine: React.FC<{
  text: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  enterDuration?: number;
  holdDuration?: number;
  exitDuration?: number;
  enterStyle?: "fade" | "slideUp" | "slideLeft" | "blur" | "scale";
  maxWidth?: string;
  textAlign?: React.CSSProperties["textAlign"];
  style?: React.CSSProperties;
}> = ({
  text,
  fontSize = 52,
  fontWeight = 700,
  color = "#ffffff",
  enterDuration = 12,
  holdDuration = 60,
  exitDuration = 10,
  enterStyle = "slideUp",
  maxWidth = "85%",
  textAlign = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = enterDuration + holdDuration + exitDuration;

  if (frame > total) return null;

  // Enter
  const enterProgress = spring({fps, frame, config: {damping: 16, stiffness: 100}});
  const enterOpacity = interpolate(frame, [0, enterDuration * 0.5], [0, 1], {extrapolateRight: "clamp"});

  // Exit
  const exitStart = enterDuration + holdDuration;
  const exitProgress = interpolate(frame, [exitStart, exitStart + exitDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isExiting = frame >= exitStart && exitDuration > 0;

  let opacity = isExiting ? 1 - exitProgress : enterOpacity;
  let transform = "none";
  let filter = "none";

  if (!isExiting) {
    switch (enterStyle) {
      case "slideUp":
        transform = `translateY(${interpolate(enterProgress, [0, 1], [40, 0])}px)`;
        break;
      case "slideLeft":
        transform = `translateX(${interpolate(enterProgress, [0, 1], [60, 0])}px)`;
        break;
      case "blur": {
        const b = interpolate(frame, [0, enterDuration], [15, 0], {extrapolateRight: "clamp"});
        filter = `blur(${b}px)`;
        break;
      }
      case "scale":
        transform = `scale(${interpolate(enterProgress, [0, 1], [0.7, 1])})`;
        break;
      default:
        break;
    }
  } else {
    transform = `translateY(${interpolate(exitProgress, [0, 1], [0, -25])}px)`;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        opacity,
        transform,
        filter,
        ...style,
      }}
    >
      <p
        style={{
          fontSize,
          fontWeight,
          color,
          textAlign,
          margin: 0,
          maxWidth,
          lineHeight: 1.25,
          fontFamily: "'Playfair Display', serif",
          letterSpacing: -0.5,
          textShadow: "0 2px 30px rgba(0,0,0,0.5)",
        }}
      >
        {text}
      </p>
    </div>
  );
};

// ─── Accent horizontal bar animation ────────────────────────────────────
const AccentBar: React.FC<{delay?: number; color?: string; width?: number}> = ({
  delay = 0,
  color = "#C9A96E",
  width = 100,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = Math.max(0, frame - delay);
  const progress = spring({fps, frame: localFrame, config: {damping: 18, stiffness: 80}});
  return (
    <div
      style={{
        width: interpolate(progress, [0, 1], [0, width]),
        height: 3,
        backgroundColor: color,
        borderRadius: 2,
        margin: "0 auto",
        opacity: interpolate(progress, [0, 0.3], [0, 1], {extrapolateRight: "clamp"}),
      }}
    />
  );
};

// ─── Logo component (SVG from file) ─────────────────────────────────────
const Logo: React.FC<{opacity?: number; scale?: number}> = ({opacity = 1, scale = 1}) => (
  <Img
    src={staticFile("assets/logo-alma.svg")}
    style={{
      height: 40,
      opacity,
      transform: `scale(${scale})`,
      filter: "brightness(0) invert(1)",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════
// FULL REEL — 35 seconds (1050 frames @ 30fps)
// ═══════════════════════════════════════════════════════════════════════
export const MetodoALMA: React.FC = () => {
  loadGoogleFont("Playfair Display");
  loadGoogleFont("Inter");

  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Subtle vignette pulsing
  const vignetteOpacity = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.4, 0.6]);

  return (
    <AbsoluteFill style={{backgroundColor: "#0a0a0a"}}>
      {/* Background */}
      <GradientBackground
        colors={["#0a0a0a", "#1a1020", "#0d0d1a"]}
        angle={160}
        animateAngle
        animateSpeed={0.15}
      />
      <ParticleField count={25} color="rgba(201,169,110,0.12)" speed={0.3} direction="up" />

      {/* Vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* ─── SCENE 1: HOOK (0s – 4s) ───────────────────────────── */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 60px"}}>
          {/* Dramatic flash on entry */}
          <AbsoluteFill
            style={{
              backgroundColor: "#C9A96E",
              opacity: interpolate(frame, [0, 8], [0.3, 0], {extrapolateRight: "clamp"}),
            }}
          />
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 20}}>
            <TextLine
              text="¿Sos líder, pero sentís que sostenés todo sola?"
              fontSize={54}
              fontWeight={700}
              enterStyle="blur"
              enterDuration={15}
              holdDuration={80}
              exitDuration={12}
            />
            <AccentBar delay={18} width={120} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ─── SCENE 2: PAIN POINT 1 (4s – 7.5s) ────────────────── */}
      <Sequence from={120} durationInFrames={105}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 60px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 24}}>
            <TextLine
              text="Delegar te cuesta."
              fontSize={58}
              fontWeight={700}
              enterStyle="slideUp"
              enterDuration={12}
              holdDuration={65}
              exitDuration={10}
            />
            <TextLine
              text="Poner límites también."
              fontSize={46}
              fontWeight={500}
              color="rgba(255,255,255,0.75)"
              enterStyle="slideUp"
              enterDuration={12}
              holdDuration={55}
              exitDuration={10}
              style={{marginTop: -10}}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ─── SCENE 3: PAIN ESCALATION (7.5s – 13s) ────────────── */}
      <Sequence from={225} durationInFrames={165}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 55px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
            <TextLine
              text="Y mientras tanto, tu rol te exige más presencia,"
              fontSize={44}
              fontWeight={600}
              enterStyle="slideLeft"
              enterDuration={14}
              holdDuration={60}
              exitDuration={10}
            />
            <TextLine
              text="más claridad"
              fontSize={50}
              fontWeight={700}
              color="#C9A96E"
              enterStyle="scale"
              enterDuration={14}
              holdDuration={50}
              exitDuration={10}
            />
            <TextLine
              text="y más estrategia."
              fontSize={50}
              fontWeight={700}
              color="#C9A96E"
              enterStyle="scale"
              enterDuration={14}
              holdDuration={40}
              exitDuration={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ─── SCENE 4: BRIDGE (13s – 17s) ──────────────────────── */}
      <Sequence from={390} durationInFrames={120}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 60px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 20}}>
            <div
              style={{
                width: 60,
                height: 1,
                backgroundColor: "#C9A96E",
                marginBottom: 10,
                opacity: interpolate(
                  useCurrentFrameInSequence(),
                  [0, 15],
                  [0, 1],
                  {extrapolateRight: "clamp"},
                ),
              }}
            />
            <TextLine
              text="No necesitás seguir aguantando."
              fontSize={48}
              fontWeight={600}
              enterStyle="fade"
              enterDuration={15}
              holdDuration={55}
              exitDuration={10}
            />
            <TextLine
              text="Necesitás otra forma de liderar."
              fontSize={52}
              fontWeight={700}
              color="#C9A96E"
              enterStyle="slideUp"
              enterDuration={15}
              holdDuration={50}
              exitDuration={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ─── SCENE 5: SOLUTION (17s – 25s) ────────────────────── */}
      <Sequence from={510} durationInFrames={240}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 50px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
            <Logo
              opacity={interpolate(
                useCurrentFrameInSequence(),
                [0, 20],
                [0, 1],
                {extrapolateRight: "clamp"},
              )}
              scale={interpolate(
                spring({fps, frame: useCurrentFrameInSequence(), config: {damping: 14, stiffness: 80}}),
                [0, 1],
                [0.8, 1],
              )}
            />
            <AccentBar delay={15} width={80} />
            <TextLine
              text="Método ALMA"
              fontSize={62}
              fontWeight={800}
              color="#C9A96E"
              enterStyle="scale"
              enterDuration={18}
              holdDuration={180}
              exitDuration={12}
            />
            <TextLine
              text="Un programa de liderazgo para mujeres que combina"
              fontSize={34}
              fontWeight={400}
              color="rgba(255,255,255,0.85)"
              enterStyle="slideUp"
              enterDuration={15}
              holdDuration={100}
              exitDuration={10}
            />
            {/* Pillars */}
            <PillarList />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ─── SCENE 6: CTA (25s – 35s) ─────────────────────────── */}
      <Sequence from={750} durationInFrames={300}>
        <CTAScene />
      </Sequence>

      {/* Progress bar */}
      <ProgressBar color="#C9A96E" height={3} position="bottom" />

      {/* Top logo watermark */}
      <AbsoluteFill style={{padding: "50px 0 0 0", alignItems: "center", justifyContent: "flex-start"}}>
        <Logo
          opacity={interpolate(frame, [0, 30], [0, 0.6], {extrapolateRight: "clamp"})}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Helper to use frame within a Sequence
function useCurrentFrameInSequence() {
  return useCurrentFrame();
}

// ─── Pillar list with staggered animation ───────────────────────────────
const PillarList: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pillars = ["Autoconocimiento", "Liderazgo", "Marca Líder", "Acción"];

  return (
    <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 10, alignItems: "center"}}>
      {pillars.map((pillar, i) => {
        const delay = 25 + i * 12;
        const localFrame = Math.max(0, frame - delay);
        const progress = spring({fps, frame: localFrame, config: {damping: 16, stiffness: 100}});
        const opacity = interpolate(localFrame, [0, 8], [0, 1], {extrapolateRight: "clamp"});

        return (
          <div
            key={pillar}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity,
              transform: `translateX(${interpolate(progress, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#C9A96E",
              }}
            />
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                color: "#ffffff",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 1,
              }}
            >
              {pillar}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── CTA Scene with photo ───────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enterProgress = spring({fps, frame, config: {damping: 14, stiffness: 80}});
  const photoOpacity = interpolate(frame, [0, 25], [0, 1], {extrapolateRight: "clamp"});
  const photoScale = interpolate(enterProgress, [0, 1], [1.05, 1]);

  const textOpacity = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: "clamp"});
  const ctaScale = spring({fps, frame: Math.max(0, frame - 50), config: {damping: 12, stiffness: 100}});

  // Subtle glow pulse on CTA button
  const glowPulse = interpolate(Math.sin((frame - 60) * 0.08), [-1, 1], [0, 12]);

  return (
    <AbsoluteFill>
      {/* Photo background with gradient overlay */}
      <AbsoluteFill
        style={{
          opacity: photoOpacity,
          transform: `scale(${photoScale})`,
        }}
      >
        <Img
          src={staticFile("assets/antonela.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />
        {/* Dark gradient overlay for text readability */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.2) 70%, transparent 100%)",
          }}
        />
      </AbsoluteFill>

      {/* CTA content at bottom */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 60px 160px",
          opacity: textOpacity,
        }}
      >
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
          <p
            style={{
              fontSize: 38,
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
              lineHeight: 1.3,
            }}
          >
            Dejá de liderar desde el agotamiento.
          </p>
          <p
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#C9A96E",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            Empezá a liderar con dirección.
          </p>

          {/* CTA Button */}
          <div
            style={{
              marginTop: 20,
              transform: `scale(${interpolate(ctaScale, [0, 1], [0.8, 1])})`,
              opacity: interpolate(ctaScale, [0, 0.5], [0, 1], {extrapolateRight: "clamp"}),
            }}
          >
            <div
              style={{
                backgroundColor: "#C9A96E",
                padding: "20px 50px",
                borderRadius: 8,
                boxShadow: `0 0 ${glowPulse}px rgba(201,169,110,0.5), 0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#0a0a0a",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Conoce Metodo ALMA
              </span>
            </div>
          </div>

          {/* Logo at bottom */}
          <div style={{marginTop: 16}}>
            <Logo opacity={interpolate(frame, [40, 60], [0, 0.8], {extrapolateRight: "clamp"})} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SHORT VERSION — 15 seconds (450 frames @ 30fps)
// ═══════════════════════════════════════════════════════════════════════
export const MetodoALMA15s: React.FC = () => {
  loadGoogleFont("Playfair Display");
  loadGoogleFont("Inter");

  const frame = useCurrentFrame();

  const vignetteOpacity = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.4, 0.6]);

  return (
    <AbsoluteFill style={{backgroundColor: "#0a0a0a"}}>
      <GradientBackground
        colors={["#0a0a0a", "#1a1020", "#0d0d1a"]}
        angle={160}
        animateAngle
        animateSpeed={0.2}
      />
      <ParticleField count={20} color="rgba(201,169,110,0.1)" speed={0.3} direction="up" />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* HOOK (0s – 3s) */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 55px"}}>
          <AbsoluteFill
            style={{
              backgroundColor: "#C9A96E",
              opacity: interpolate(frame, [0, 6], [0.25, 0], {extrapolateRight: "clamp"}),
            }}
          />
          <TextLine
            text="¿Sos líder, pero sentís que sostenés todo sola?"
            fontSize={50}
            fontWeight={700}
            enterStyle="blur"
            enterDuration={12}
            holdDuration={55}
            exitDuration={10}
          />
        </AbsoluteFill>
      </Sequence>

      {/* PAIN (3s – 6s) */}
      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 55px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
            <TextLine
              text="Delegar te cuesta. Poner límites también."
              fontSize={44}
              fontWeight={600}
              enterStyle="slideUp"
              enterDuration={10}
              holdDuration={55}
              exitDuration={10}
            />
            <TextLine
              text="Y tu rol te exige más."
              fontSize={48}
              fontWeight={700}
              color="#C9A96E"
              enterStyle="slideUp"
              enterDuration={12}
              holdDuration={50}
              exitDuration={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SOLUTION (6s – 10s) */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: "0 50px"}}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
            <TextLine
              text="Método ALMA"
              fontSize={60}
              fontWeight={800}
              color="#C9A96E"
              enterStyle="scale"
              enterDuration={15}
              holdDuration={80}
              exitDuration={10}
            />
            <TextLine
              text="Liderazgo femenino con dirección."
              fontSize={36}
              fontWeight={500}
              color="rgba(255,255,255,0.85)"
              enterStyle="slideUp"
              enterDuration={12}
              holdDuration={70}
              exitDuration={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA (10s – 15s) */}
      <Sequence from={300} durationInFrames={150}>
        <CTASceneShort />
      </Sequence>

      <ProgressBar color="#C9A96E" height={3} position="bottom" />

      {/* Top logo */}
      <AbsoluteFill style={{padding: "50px 0 0 0", alignItems: "center", justifyContent: "flex-start"}}>
        <Logo opacity={interpolate(frame, [0, 20], [0, 0.5], {extrapolateRight: "clamp"})} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Short CTA scene ────────────────────────────────────────────────────
const CTASceneShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const photoOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});
  const enterProgress = spring({fps, frame, config: {damping: 14, stiffness: 80}});
  const photoScale = interpolate(enterProgress, [0, 1], [1.05, 1]);
  const textOpacity = interpolate(frame, [15, 30], [0, 1], {extrapolateRight: "clamp"});
  const ctaScale = spring({fps, frame: Math.max(0, frame - 35), config: {damping: 12, stiffness: 100}});
  const glowPulse = interpolate(Math.sin((frame - 45) * 0.08), [-1, 1], [0, 12]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: photoOpacity, transform: `scale(${photoScale})`}}>
        <Img
          src={staticFile("assets/antonela.jpg")}
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top"}}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.2) 70%, transparent 100%)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{justifyContent: "flex-end", alignItems: "center", padding: "0 60px 160px", opacity: textOpacity}}
      >
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
          <p
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#C9A96E",
              fontFamily: "'Playfair Display', serif",
              textAlign: "center",
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.7)",
            }}
          >
            Empezá a liderar con dirección.
          </p>
          <div
            style={{
              marginTop: 14,
              transform: `scale(${interpolate(ctaScale, [0, 1], [0.8, 1])})`,
              opacity: interpolate(ctaScale, [0, 0.5], [0, 1], {extrapolateRight: "clamp"}),
            }}
          >
            <div
              style={{
                backgroundColor: "#C9A96E",
                padding: "18px 44px",
                borderRadius: 8,
                boxShadow: `0 0 ${glowPulse}px rgba(201,169,110,0.5), 0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#0a0a0a",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Conoce Metodo ALMA
              </span>
            </div>
          </div>
          <div style={{marginTop: 12}}>
            <Logo opacity={interpolate(frame, [30, 50], [0, 0.8], {extrapolateRight: "clamp"})} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
