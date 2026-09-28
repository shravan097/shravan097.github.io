import * as React from "react"
import { Link, HeadFC } from "gatsby"

/**
 * 404 — "Lost in the Void"
 * A DVD-screensaver meme page: the logo bounces around, shifts color on every
 * wall hit, and if it ever lands a (near-)perfect corner you get confetti.
 */

const PALETTE = [
  "#ff3b3b",
  "#3bff6b",
  "#3b9dff",
  "#ffe93b",
  "#ff3bd9",
  "#3bffe9",
  "#ffffff",
]

const CAPTIONS = [
  "404: this page has achieved sentience and left.",
  "Have you tried going home?",
  "The void stares back. It says: 404.",
  "This page is fine. (it is not fine)",
  "Somewhere out there, a page exists. Not this one.",
  "Error 404: plot armor not found.",
  "Even the logo is lost out here.",
  "You've reached the corner of the internet. Keep going.",
  "psst… if the logo ever hits a corner, something happens.",
]

/** How close to a corner counts as a "perfect corner" (px). */
const CORNER_TOLERANCE = 12

type ConfettiPiece = {
  left: number
  delay: number
  duration: number
  size: number
  color: string
  drift: number
}

function makeConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    duration: 2.2 + Math.random() * 1.8,
    size: 6 + Math.random() * 8,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    drift: (Math.random() - 0.5) * 240,
  }))
}

/** DVD-Video-logo style mark, rebranded. Uses currentColor so bounces can recolor it. */
const DvdLogo: React.FC = () => (
  <svg viewBox="0 0 240 120" aria-hidden="true">
    <text
      x="120"
      y="56"
      textAnchor="middle"
      fontFamily="Arial Black, Arial, sans-serif"
      fontSize="44"
      fontWeight="900"
      fontStyle="italic"
      fill="currentColor"
    >
      shravan
    </text>
    <ellipse cx="120" cy="92" rx="46" ry="17" fill="currentColor" />
    <text
      x="120"
      y="98"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
      fontSize="16"
      fontWeight="bold"
      fill="#05080c"
    >
      OS
    </text>
  </svg>
)

const PAGE_CSS = `
.os-404-stage {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 0%, #101820 0%, #0a0f14 55%, #05080c 100%);
  font-family: "SF Mono", Menlo, Monaco, "Courier New", monospace;
}
.os-404-stage.crt-shake { animation: os404-shake 0.16s linear; }
@keyframes os404-shake {
  0% { transform: translate(0, 0); }
  25% { transform: translate(2px, -2px); }
  50% { transform: translate(-2px, 2px); }
  75% { transform: translate(1px, 1px); }
  100% { transform: translate(0, 0); }
}
.os-404-scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px);
  box-shadow: inset 0 0 80px rgba(0,0,0,0.6);
}
.os-404-hud {
  position: absolute;
  top: 12px;
  left: 14px;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #475569;
}
.os-404-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  padding: 0 20px;
  pointer-events: none;
}
.os-404-title {
  margin: 0;
  font-size: clamp(5rem, 20vw, 11rem);
  font-weight: 800;
  line-height: 1;
  color: #e2e8f0;
  text-shadow: 0 0 24px rgba(129,140,248,0.55), 0 0 60px rgba(129,140,248,0.25);
}
.os-404-sub {
  margin: 0;
  color: #94a3b8;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
}
.os-404-home {
  pointer-events: auto;
  display: inline-block;
  margin-top: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
  color: #0a0f14;
  background: #4ade80;
  box-shadow: 0 0 18px rgba(74,222,128,0.5);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.os-404-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 28px rgba(74,222,128,0.7);
}
.os-404-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: min(58vw, 230px);
  pointer-events: none;
  will-change: transform;
}
.os-404-logo svg { display: block; width: 100%; height: auto; }
.os-404-logo-static {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.os-404-caption {
  position: absolute;
  bottom: 18px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #64748b;
  padding: 0 16px;
}
.os-404-celebrate {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  pointer-events: none;
  animation: os404-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.os-404-celebrate-text {
  font-size: clamp(1.6rem, 7vw, 3.4rem);
  font-weight: 800;
  color: #ffe93b;
  text-shadow: 0 0 24px rgba(255,233,59,0.6);
}
.os-404-celebrate-sub {
  color: #e2e8f0;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
}
@keyframes os404-pop {
  0% { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.os-404-confetti {
  position: absolute;
  top: -20px;
  border-radius: 2px;
  animation: os404-confetti-fall linear forwards;
}
@keyframes os404-confetti-fall {
  0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) translateX(var(--drift, 0px)) rotate(720deg); opacity: 0.8; }
}
`

const NotFoundPage = () => {
  const [mounted, setMounted] = React.useState(false)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [bounces, setBounces] = React.useState(0)
  const [cornerHits, setCornerHits] = React.useState(0)
  const [celebrating, setCelebrating] = React.useState(false)
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([])
  const [captionIdx, setCaptionIdx] = React.useState(0)

  const stageRef = React.useRef<HTMLDivElement>(null)
  const logoRef = React.useRef<HTMLDivElement>(null)
  const shakeTimer = React.useRef<number | null>(null)
  const celebrateTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    setMounted(true)
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  // Cycle the meme captions.
  React.useEffect(() => {
    if (!mounted || reducedMotion) return
    const id = window.setInterval(
      () => setCaptionIdx(i => (i + 1) % CAPTIONS.length),
      4000
    )
    return () => window.clearInterval(id)
  }, [mounted, reducedMotion])

  // DVD physics: rAF loop mutates the logo transform directly (no re-render per frame).
  React.useEffect(() => {
    if (!mounted || reducedMotion) return
    const stage = stageRef.current
    const logo = logoRef.current
    if (!stage || !logo) return

    const s = {
      x: 0,
      y: 0,
      vx: Math.random() > 0.5 ? 1 : -1,
      vy: Math.random() > 0.5 ? 1 : -1,
      colorIdx: 0,
      lastCorner: 0,
      inited: false,
    }
    logo.style.color = PALETTE[0]
    logo.style.filter = `drop-shadow(0 0 18px ${PALETTE[0]})`

    let raf = 0
    let last = performance.now()

    const step = (now: number) => {
      const vw = stage.clientWidth
      const vh = stage.clientHeight
      const w = logo.offsetWidth
      const h = logo.offsetHeight
      if (!s.inited) {
        s.x = (vw - w) / 2
        s.y = (vh - h) / 2
        s.inited = true
      }

      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const speed = Math.max(180, Math.min(vw, vh) * 0.38)
      s.x += s.vx * speed * dt
      s.y += s.vy * speed * dt

      let bounced = false
      if (s.x <= 0) {
        s.x = 0
        s.vx = Math.abs(s.vx)
        bounced = true
      } else if (s.x + w >= vw) {
        s.x = vw - w
        s.vx = -Math.abs(s.vx)
        bounced = true
      }
      if (s.y <= 0) {
        s.y = 0
        s.vy = Math.abs(s.vy)
        bounced = true
      } else if (s.y + h >= vh) {
        s.y = vh - h
        s.vy = -Math.abs(s.vy)
        bounced = true
      }

      if (bounced) {
        s.colorIdx = (s.colorIdx + 1) % PALETTE.length
        const c = PALETTE[s.colorIdx]
        logo.style.color = c
        logo.style.filter = `drop-shadow(0 0 18px ${c})`
        setBounces(b => b + 1)

        stage.classList.add("crt-shake")
        if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current)
        shakeTimer.current = window.setTimeout(
          () => stage.classList.remove("crt-shake"),
          160
        )

        const nearLeft = s.x <= CORNER_TOLERANCE
        const nearRight = s.x + w >= vw - CORNER_TOLERANCE
        const nearTop = s.y <= CORNER_TOLERANCE
        const nearBottom = s.y + h >= vh - CORNER_TOLERANCE
        if ((nearLeft || nearRight) && (nearTop || nearBottom) && now - s.lastCorner > 1500) {
          s.lastCorner = now
          setCornerHits(n => n + 1)
          setConfetti(makeConfetti(90))
          setCelebrating(true)
          if (celebrateTimer.current !== null) window.clearTimeout(celebrateTimer.current)
          celebrateTimer.current = window.setTimeout(() => {
            setCelebrating(false)
            setConfetti([])
          }, 4200)
        }
      }

      logo.style.transform = `translate(${s.x}px, ${s.y}px)`
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      if (shakeTimer.current !== null) window.clearTimeout(shakeTimer.current)
      if (celebrateTimer.current !== null) window.clearTimeout(celebrateTimer.current)
    }
  }, [mounted, reducedMotion])

  return (
    <div ref={stageRef} className="os-404-stage">
      <style>{PAGE_CSS}</style>
      <div className="os-404-scanlines" />

      <div className="os-404-hud">
        bounces {String(bounces).padStart(3, "0")} · corners {String(cornerHits).padStart(2, "0")}
      </div>

      <div className="os-404-center">
        <h1 className="os-404-title">404</h1>
        <p className="os-404-sub">This page got lost in the void.</p>
        <Link to="/" className="os-404-home">
          ← Go home
        </Link>
      </div>

      {mounted && (reducedMotion ? (
        <div className="os-404-logo os-404-logo-static" style={{ color: PALETTE[0] }} aria-hidden="true">
          <DvdLogo />
        </div>
      ) : (
        <div ref={logoRef} className="os-404-logo" aria-hidden="true">
          <DvdLogo />
        </div>
      ))}

      <div className="os-404-caption">{CAPTIONS[captionIdx]}</div>

      {celebrating && (
        <div className="os-404-celebrate">
          <div className="os-404-celebrate-text">🏆 PERFECT CORNER!</div>
          <div className="os-404-celebrate-sub">
            You hit the corner. The odds were terrible. Iconic.
          </div>
        </div>
      )}

      {confetti.map((piece, i) => (
        <span
          key={`${i}-${piece.left}`}
          className="os-404-confetti"
          style={
            {
              left: `${piece.left}%`,
              width: piece.size,
              height: piece.size * 0.45,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--drift": `${piece.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>404 — Lost in the Void · Shravan OS</title>
