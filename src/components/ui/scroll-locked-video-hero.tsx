"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

// Scroll-scrub video hero — sticky + tall-wrapper pattern.
//
// A wrapper div extends beyond the viewport by `scrubDistance` pixels.
// The visible section is `position: sticky` and stays in view while the
// user scrolls through the wrapper. Scroll position drives video.currentTime
// via a seek-queue so the video decoder isn't overwhelmed. Text overlays
// track the *confirmed* video position (what the user actually sees) so
// they never race ahead of the video frame.

export interface MetroHeroProps {
  videoSrc?: string
  title?: string
  subtitle?: string
  scrollHint?: string
  tagline?: string
  signature?: { name: string; url: string } | false
  /** Extra scroll distance (px) the wrapper extends beyond the viewport. */
  scrubDistance?: number
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_VIDEO =
  "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
const SANS =
  "var(--font-heading), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const COL_BG = "#05070d"
const COL_TEXT = "#f2f4f8"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", onChange)
  return () => mediaQuery.removeEventListener("change", onChange)
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

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
  scrubDistance = 4000,
  className,
  style,
}: MetroHeroProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const skipScrub = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  const { height: sectionHeight = "100dvh", ...restStyle } = style || {}

  useEffect(() => {
    const video = videoRef.current
    const wrapper = wrapperRef.current
    if (!video || !wrapper) return

    let duration = 0
    let rafId = 0

    // ---- seek queue ----
    // Only one seek in-flight at a time. This prevents flooding the video
    // decoder with rapid currentTime writes (which causes the video to
    // freeze on an old frame while overlays race ahead).
    let isSeeking = false
    let pendingTime: number | null = null
    let lastSetTime = -1
    // confirmedProgress = the progress the video has actually seeked to
    // and the user can see. Overlays are driven by this, NOT by scroll
    // position, so they stay perfectly in sync with the visible frame.
    let confirmedProgress = 0

    const onReady = () => {
      duration = video.duration || 0
      setReady(true)
      if (skipScrub) video.currentTime = duration * 0.92
    }
    video.addEventListener("loadeddata", onReady)
    video.addEventListener("canplay", onReady)
    if (video.readyState >= 2) onReady()

    const onSeeked = () => {
      isSeeking = false
      if (duration > 0) confirmedProgress = video.currentTime / duration
      if (pendingTime !== null) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        video.currentTime = t
      }
    }
    video.addEventListener("seeked", onSeeked)

    function seekTo(timeSec: number) {
      if (!video) return
      if (Math.abs(timeSec - lastSetTime) < 0.04) return
      lastSetTime = timeSec
      if (isSeeking) {
        pendingTime = timeSec
        return
      }
      isSeeking = true
      video.currentTime = timeSec
    }

    // iOS Safari: kick playback to start buffering.
    const p = video.play()
    if (p?.then) p.then(() => video.pause()).catch(() => {})
    else video.pause()

    if (skipScrub) {
      return () => {
        video.removeEventListener("loadeddata", onReady)
        video.removeEventListener("canplay", onReady)
        video.removeEventListener("seeked", onSeeked)
      }
    }

    // ---- scroll-driven animation loop ----
    function tick() {
      if (!wrapper || !video) return

      const stickyEl = wrapper.firstElementChild as HTMLElement | null
      const stickyH = stickyEl?.offsetHeight || window.innerHeight
      const scrollable = wrapper.offsetHeight - stickyH
      const rect = wrapper.getBoundingClientRect()
      const scrollTarget =
        scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0

      // Drive video time via the seek queue.
      if (duration > 0) {
        seekTo(scrollTarget * duration)
      }

      // Use confirmedProgress for all visuals so overlays track the
      // actual video frame, not where the scroll says we should be.
      const vp = confirmedProgress

      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + vp * 0.06})`
      }
      if (titleRef.current) {
        const t = 1 - clamp(vp / 0.35, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = vp > 0.01 ? "0" : "1"
      }
      if (taglineRef.current) {
        const t = clamp((vp - 0.82) / 0.18, 0, 1)
        taglineRef.current.style.opacity = String(t)
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${vp})`
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      video.removeEventListener("loadeddata", onReady)
      video.removeEventListener("canplay", onReady)
      video.removeEventListener("seeked", onSeeked)
      cancelAnimationFrame(rafId)
    }
  }, [skipScrub, scrubDistance])

  const heightStr =
    typeof sectionHeight === "number" ? `${sectionHeight}px` : sectionHeight
  const wrapperHeight = skipScrub
    ? sectionHeight
    : `calc(${heightStr} + ${scrubDistance}px)`

  return (
    <div ref={wrapperRef} style={{ height: wrapperHeight }}>
      <div
        className={className}
        style={{
          position: skipScrub ? "relative" : "sticky",
          top: 0,
          height: sectionHeight,
          width: "100%",
          overflow: "hidden",
          background: COL_BG,
          ...restStyle,
        }}
      >
        {/* ---- video ---- */}
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

        {/* ---- gradient overlay ---- */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,7,13,0.55), rgba(5,7,13,0.25) 35%, rgba(5,7,13,0.3) 70%, rgba(5,7,13,0.7))",
            pointerEvents: "none",
          }}
        />

        {/* ---- title / subtitle ---- */}
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

        {/* ---- end-of-scrub tagline ---- */}
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

        {/* ---- scroll hint ---- */}
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
          <svg
            width="14"
            height="18"
            viewBox="0 0 14 18"
            style={{
              animation: "metro-hero-bounce 1.6s ease-in-out infinite",
            }}
          >
            <style>{`
              @keyframes metro-hero-bounce {
                0%, 100% { transform: translateY(0); opacity: 0.5; }
                50% { transform: translateY(5px); opacity: 1; }
              }
            `}</style>
            <path
              d="M7 1 L7 17 M2 12 L7 17 L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ---- progress bar ---- */}
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
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.95))",
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* ---- signature ---- */}
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
    </div>
  )
}
