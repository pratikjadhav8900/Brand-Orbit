"use client"

import { useEffect, useRef, useState } from "react"

// Locked scroll-scrub video hero. While active, the body is pinned with
// position:fixed and wheel/touch input only drives video.currentTime. Once the
// video reaches the end and the visitor keeps pushing forward, the page
// unlocks and scrolls normally; scrolling back up to the top re-locks it.
// With prefers-reduced-motion the page is never locked.

export interface MetroHeroProps {
  videoSrc?: string
  title?: string
  subtitle?: string
  scrollHint?: string
  tagline?: string
  signature?: { name: string; url: string } | false
  /** Total input distance (px) needed to scrub the full video. Tune to taste. */
  scrubDistance?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_VIDEO = "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
const SANS = "var(--font-heading), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const COL_BG = "#05070d"
const COL_TEXT = "#f2f4f8"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export default function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  title = "THE CITY OPENS",
  subtitle,
  scrollHint = "SCROLL",
  tagline = "Every door in the city is already open.",
  signature = false,
  scrubDistance = 3200,
  className,
  style,
}: MetroHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let duration = 0
    let rafId = 0
    let targetProgress = 0
    let currentProgress = 0
    let hasStartedScrolling = false
    let locked = false
    let lockedScrollY = 0
    let touchStartY = 0
    /** Max progress jump per wheel event — prevents fast-scroll from skipping the whole video. */
    const MAX_DELTA = 0.06

    const onLoadedData = () => {
      duration = video.duration || 0
      setReady(true)
      if (reduceMotion) {
        video.currentTime = duration * 0.92
      }
    }
    video.addEventListener("loadeddata", onLoadedData)
    video.addEventListener("canplay", onLoadedData)
    // The SSR'd <video> can finish loading before hydration attaches the listeners above.
    if (video.readyState >= 2) onLoadedData()

    // iOS Safari won't buffer video data until playback starts, so kick it
    // with a silent play-then-pause.
    const kickstartLoad = () => {
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {})
      } else {
        video.pause()
      }
    }
    kickstartLoad()

    function engageLock() {
      if (locked) return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
      b.height = "100%"
      b.overscrollBehavior = "none"
      section!.style.touchAction = "none"
    }

    function releaseLock() {
      if (!locked) return
      locked = false
      const y = lockedScrollY
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.height = ""
      b.overscrollBehavior = ""
      section!.style.touchAction = "pan-y"
      window.scrollTo(0, y)
    }

    // Returns true when the input was consumed by the video (caller should
    // preventDefault), false when the page should scroll natively.
    function handleInput(deltaY: number) {
      if (!locked) {
        if (deltaY < 0 && window.scrollY <= 0) {
          engageLock()
        } else {
          return false
        }
      }
      // Gate release on what the user has *actually seen*, not where target is headed.
      // This prevents fast scrolling from skipping past the video.
      if (deltaY > 0 && currentProgress >= 0.97) {
        releaseLock()
        return false
      }
      // Cap per-event delta so fast flicks can't jump targetProgress to 1 instantly.
      const cappedDelta = clamp(deltaY / scrubDistance, -MAX_DELTA, MAX_DELTA)
      targetProgress = clamp(targetProgress + cappedDelta, 0, 1)
      if (targetProgress > 0.001) hasStartedScrolling = true
      return true
    }

    const onWheel = (e: WheelEvent) => {
      if (handleInput(e.deltaY)) e.preventDefault()
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      touchStartY = y
      if (handleInput(deltaY)) e.preventDefault()
    }

    if (!reduceMotion) {
      if (window.scrollY > 0) {
        // Landed mid-page (reload / back navigation): show the finished state, stay unlocked.
        targetProgress = 1
        currentProgress = 1
        hasStartedScrolling = true
        section.style.touchAction = "pan-y"
      } else {
        engageLock()
      }

      window.addEventListener("wheel", onWheel, { passive: false })
      window.addEventListener("touchstart", onTouchStart, { passive: true })
      window.addEventListener("touchmove", onTouchMove, { passive: false })
    }

    function frame() {
      // Faster lerp (0.28) for snappier response; reduces perceived lag.
      currentProgress += (targetProgress - currentProgress) * 0.28

      // Snap to target when very close to avoid endless micro-seeking.
      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress
      }

      // Set video time directly — no seek queue. Modern browsers handle rapid
      // currentTime writes fine and this avoids the jank from queued seeks.
      if (duration > 0) {
        video!.currentTime = currentProgress * duration
      }

      if (videoRef.current) {
        const scale = 1 + currentProgress * 0.06
        videoRef.current.style.transform = `scale(${scale})`
      }
      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.35, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
      }
      if (taglineRef.current) {
        const t = clamp((currentProgress - 0.82) / 0.18, 0, 1)
        taglineRef.current.style.opacity = String(t)
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentProgress})`
      }

      rafId = requestAnimationFrame(frame)
    }

    if (!reduceMotion) {
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      video.removeEventListener("loadeddata", onLoadedData)
      video.removeEventListener("canplay", onLoadedData)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      cancelAnimationFrame(rafId)
      releaseLock()
    }
  }, [scrubDistance])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: COL_BG,
        ...style,
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: ready ? 1 : 0,
          transformOrigin: "center center",
          willChange: "transform",
          transition: "opacity 0.6s ease",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(5,7,13,0.55), rgba(5,7,13,0.25) 35%, rgba(5,7,13,0.3) 70%, rgba(5,7,13,0.7))",
          pointerEvents: "none",
        }}
      />

      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(14px, 2.4vw, 28px)",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "clamp(30px, 6.2vw, 88px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: COL_TEXT,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            maxWidth: "16ch",
            margin: 0,
            willChange: "transform, filter, opacity",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: SANS,
              fontWeight: 500,
              fontSize: "clamp(14px, 1.6vw, 20px)",
              lineHeight: 1.5,
              color: "rgba(242,244,248,0.82)",
              textShadow: "0 2px 16px rgba(0,0,0,0.6)",
              maxWidth: "46ch",
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {tagline && (
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8%",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "clamp(20px, 3.4vw, 40px)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              maxWidth: "26ch",
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px, 6vh, 48px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "rgba(240,244,248,0.75)",
          fontFamily: SANS,
          fontSize: "clamp(10px, 1.4vw, 12px)",
          fontWeight: 600,
          letterSpacing: "0.3em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg width="14" height="18" viewBox="0 0 14 18" style={{ animation: "metro-hero-bounce 1.6s ease-in-out infinite" }}>
          <style>{`
            @keyframes metro-hero-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(5px); opacity: 1; }
            }
          `}</style>
          <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.95))",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {signature && (
        <span
          style={{
            position: "absolute",
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: "clamp(11px, 1.4vw, 13px)",
            color: "rgba(220,224,232,0.6)",
            zIndex: 2,
          }}
        >
          by{" "}
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {signature.name}
          </a>
        </span>
      )}
    </div>
  )
}
