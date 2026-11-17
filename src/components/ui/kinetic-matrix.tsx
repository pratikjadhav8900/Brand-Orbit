'use client';

import React, { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

interface MatrixNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    col: number;
    row: number;
    radius: number;
    label: string;
    tension: number;
    pulsePhase: number;
}

interface SynapticPulse {
    fromNode: number;
    toNode: number;
    progress: number;
    speed: number;
}

interface GravitationalShockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    power: number;
}

export interface KineticMatrixProps {
    title?: string;
    className?: string;
    titleClassName?: string;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeColorScheme(onChange: () => void) {
    const mediaQuery = window.matchMedia(DARK_QUERY);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
}

function getColorScheme() {
    return window.matchMedia(DARK_QUERY).matches;
}

function drawLatticeLink(
    ctx: CanvasRenderingContext2D,
    n1: MatrixNode,
    n2: MatrixNode,
    restLen: number,
    isDark: boolean,
    nodeColor: string
) {
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const stretch = Math.abs(dist - restLen) / restLen;
    const isTensioned = n1.tension > 0.05 || n2.tension > 0.05 || stretch > 0.1;

    if (isTensioned) {
        const glow = Math.max(n1.tension, n2.tension, stretch * 2);
        ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${Math.min(1, 0.25 + glow * 0.75)})`
            : `rgba(0, 0, 0, ${Math.min(1, 0.25 + glow * 0.75)})`;
        ctx.lineWidth = 0.8 + glow * 1.4;
    } else {
        ctx.strokeStyle = `rgba(${nodeColor}, ${isDark ? 0.08 : 0.05})`;
        ctx.lineWidth = 0.65;
    }

    ctx.beginPath();
    ctx.moveTo(n1.x, n1.y);
    ctx.lineTo(n2.x, n2.y);
    ctx.stroke();
}

export function KineticMatrix({
    title = "TOPOLOGY",
    className = "",
    titleClassName = "",
}: KineticMatrixProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const isDarkMode = useSyncExternalStore(subscribeColorScheme, getColorScheme, () => true);

    // Pointer state with smooth inertia
    const pointerRef = useRef({
        x: -2000,
        y: -2000,
        prevX: -2000,
        prevY: -2000,
        vx: 0,
        vy: 0,
        radius: 220,
        isDown: false,
        lastInteractionTime: 0,
    });

    // Scroll & virtual movement state (for mobile and scroll-over effects)
    const scrollEffectRef = useRef({
        lastScrollY: 0,
        scrollVelocity: 0,
        virtualX: 0,
        virtualY: 0,
        isInView: false,
    });

    const nodesRef = useRef<MatrixNode[]>([]);
    const pulsesRef = useRef<SynapticPulse[]>([]);
    const shockwavesRef = useRef<GravitationalShockwave[]>([]);
    const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, spacing: 52 });

    // Grid lattice initializer
    const buildLattice = useCallback((width: number, height: number) => {
        const spacing = 52;
        const cols = Math.ceil(width / spacing) + 1;
        const rows = Math.ceil(height / spacing) + 1;
        const nodes: MatrixNode[] = [];

        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const x = c * spacing;
                const y = r * spacing;
                nodes.push({
                    x,
                    y,
                    vx: 0,
                    vy: 0,
                    baseX: x,
                    baseY: y,
                    col: c,
                    row: r,
                    radius: 1.4,
                    label: `0x${((c * 17 + r * 31) % 256).toString(16).padStart(2, '0').toUpperCase()}`,
                    tension: 0,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        }

        dimensionsRef.current = { width, height, cols, rows, spacing };
        nodesRef.current = nodes;
        pulsesRef.current = [];
    }, []);

    // Canvas Resize Observer with subpixel rounding correction
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const rect = entry.contentRect;
                const dpr = Math.min(window.devicePixelRatio || 1, 2);

                canvas.width = Math.floor(rect.width * dpr);
                canvas.height = Math.floor(rect.height * dpr);
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;

                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
                buildLattice(rect.width, rect.height);
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [buildLattice]);

    // Window scroll tracking to drive dynamic distortion when scrolling over/near the component
    useEffect(() => {
        let lastY = window.scrollY;

        const onScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const viewH = window.innerHeight;

            // Check if visible
            const visible = rect.bottom > 0 && rect.top < viewH;
            scrollEffectRef.current.isInView = visible;

            const currentY = window.scrollY;
            const deltaY = currentY - lastY;
            lastY = currentY;

            if (visible) {
                const clampedDelta = Math.max(-60, Math.min(60, deltaY));
                scrollEffectRef.current.scrollVelocity += clampedDelta * 0.45;

                // Progress of component entering/exiting the viewport (0 at bottom, 1 at top)
                const totalDist = viewH + rect.height;
                const progress = Math.max(0, Math.min(1, (viewH - rect.top) / totalDist));

                // Position virtual warp center across the grid based on scroll position
                const targetVirtualX = rect.width * (0.5 + 0.28 * Math.sin(progress * Math.PI * 2.5));
                const targetVirtualY = rect.height * (0.2 + progress * 0.6);

                scrollEffectRef.current.virtualX = targetVirtualX;
                scrollEffectRef.current.virtualY = targetVirtualY;

                // On fast scroll, trigger a shockwave to accentuate the kinetic response
                if (Math.abs(deltaY) > 28 && shockwavesRef.current.length < 3) {
                    shockwavesRef.current.push({
                        x: targetVirtualX,
                        y: targetVirtualY,
                        radius: 12,
                        maxRadius: Math.min(rect.width * 0.8, 380),
                        power: Math.min(1.4, Math.abs(deltaY) * 0.02),
                    });
                }
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Main High-Performance Simulation & Rendering Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animId = 0;
        let lastTime = performance.now();

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.033);
            lastTime = now;

            const { width, height, cols, rows, spacing } = dimensionsRef.current;
            const nodes = nodesRef.current;
            const pulses = pulsesRef.current;
            const shockwaves = shockwavesRef.current;
            const pointer = pointerRef.current;
            const scrollEffect = scrollEffectRef.current;

            // Decay scroll velocity smoothly
            scrollEffect.scrollVelocity *= Math.pow(0.85, dt * 60);

            // Determine active focal point: direct touch/mouse vs scroll/ambient
            const hasDirectInput = pointer.x > -1000 && (now - pointer.lastInteractionTime < 600);

            let focalX = pointer.x;
            let focalY = pointer.y;
            let focalRadius = Math.max(160, Math.min(240, width * 0.45));
            let focalForceMultiplier = 1;
            let showFocalHud = false;

            if (hasDirectInput) {
                // Direct user touch / mouse
                pointer.vx = (pointer.x - pointer.prevX) / (dt * 1000 || 1);
                pointer.vy = (pointer.y - pointer.prevY) / (dt * 1000 || 1);
                pointer.prevX = pointer.x;
                pointer.prevY = pointer.y;
                focalForceMultiplier = 1 + (pointer.isDown ? 1.4 : 0);
                showFocalHud = true;
            } else if (scrollEffect.isInView && width > 0 && height > 0) {
                // Scroll-induced or ambient mobile drift
                const ambientWaveX = Math.sin(now * 0.0014) * (width * 0.22);
                const ambientWaveY = Math.cos(now * 0.0019) * (height * 0.18);

                focalX = (scrollEffect.virtualX || width * 0.5) + ambientWaveX;
                focalY = (scrollEffect.virtualY || height * 0.5) + ambientWaveY;

                // Scroll velocity elevates force
                const scrollSpeed = Math.abs(scrollEffect.scrollVelocity);
                focalForceMultiplier = 0.85 + Math.min(1.8, scrollSpeed * 0.08);
                focalRadius = Math.max(170, Math.min(260, width * 0.48));
                showFocalHud = true;
            }

            const mouseSpeed = hasDirectInput
                ? Math.sqrt(pointer.vx * pointer.vx + pointer.vy * pointer.vy)
                : Math.abs(scrollEffect.scrollVelocity) * 12;

            const isDark = document.documentElement.classList.contains('dark') || isDarkMode;
            const bgColor = isDark ? '#06070a' : '#f9fafb';
            const nodeColor = isDark ? '255, 255, 255' : '17, 24, 39';
            const accentGlow = isDark ? '255, 255, 255' : '0, 0, 0';

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            // 1. Propagate Shockwaves
            for (let s = shockwaves.length - 1; s >= 0; s--) {
                const sw = shockwaves[s];
                sw.radius += 420 * dt;
                sw.power *= Math.pow(0.12, dt);
                if (sw.radius > sw.maxRadius || sw.power < 0.01) {
                    shockwaves.splice(s, 1);
                }
            }

            // 2. Physics Step (Hooke's Spring-Mass Lattice)
            const SPRING_K = 26;
            const DAMPING = 0.86;
            const scrollVel = scrollEffect.scrollVelocity;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulsePhase += dt * 3.2;

                // Focal Point Repulsion (mouse, touch, or scroll wave)
                if (focalX > -1000) {
                    const dx = focalX - n.x;
                    const dy = focalY - n.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < focalRadius && dist > 0) {
                        const ratio = 1 - dist / focalRadius;
                        const force = ratio * (1500 + mouseSpeed * 160) * focalForceMultiplier;
                        const angle = Math.atan2(dy, dx);

                        n.vx -= Math.cos(angle) * force * dt;
                        n.vy -= Math.sin(angle) * force * dt;
                        n.tension = Math.min(1, n.tension + ratio * 0.45);
                    }
                }

                // Scroll inertial wave across lattice
                if (Math.abs(scrollVel) > 0.4) {
                    const wavePhase = Math.sin(n.col * 0.5 + now * 0.003);
                    n.vy -= scrollVel * 0.42 * (1 + wavePhase * 0.35);
                    n.vx += wavePhase * scrollVel * 0.18;
                    n.tension = Math.min(1, n.tension + Math.abs(scrollVel) * 0.012);
                }

                // Shockwave forces
                for (let s = 0; s < shockwaves.length; s++) {
                    const sw = shockwaves[s];
                    const swDx = n.x - sw.x;
                    const swDy = n.y - sw.y;
                    const swDist = Math.sqrt(swDx * swDx + swDy * swDy);
                    const delta = Math.abs(swDist - sw.radius);

                    if (delta < 55) {
                        const force = (1 - delta / 55) * sw.power * 2800;
                        const angle = Math.atan2(swDy, swDx);
                        n.vx += Math.cos(angle) * force * dt;
                        n.vy += Math.sin(angle) * force * dt;
                        n.tension = 1.0;
                    }
                }

                // Spring restore
                const hx = n.baseX - n.x;
                const hy = n.baseY - n.y;
                n.vx += hx * SPRING_K * dt;
                n.vy += hy * SPRING_K * dt;

                n.vx *= DAMPING;
                n.vy *= DAMPING;
                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;

                n.tension = Math.max(0, n.tension - dt * 0.9);
            }

            // 3. Spawn Random Synaptic Traveling Pulses
            if (Math.random() < 0.32 && nodes.length > 0 && pulses.length < 40) {
                const fromIdx = Math.floor(Math.random() * nodes.length);
                const fromNode = nodes[fromIdx];
                const possibleDirections = [
                    { dc: 1, dr: 0 },
                    { dc: -1, dr: 0 },
                    { dc: 0, dr: 1 },
                    { dc: 0, dr: -1 },
                ];
                const dir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                const targetCol = fromNode.col + dir.dc;
                const targetRow = fromNode.row + dir.dr;

                if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
                    const toIdx = targetCol * rows + targetRow;
                    if (toIdx >= 0 && toIdx < nodes.length) {
                        pulses.push({
                            fromNode: fromIdx,
                            toNode: toIdx,
                            progress: 0,
                            speed: 1.6 + Math.random() * 2.2,
                        });
                    }
                }
            }

            // 4. Render Grid Tension Strands
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const idx = c * rows + r;
                    const n = nodes[idx];
                    if (!n) continue;

                    if (c < cols - 1) {
                        const rightIdx = (c + 1) * rows + r;
                        const nr = nodes[rightIdx];
                        if (nr) drawLatticeLink(ctx, n, nr, spacing, isDark, nodeColor);
                    }

                    if (r < rows - 1) {
                        const downIdx = c * rows + (r + 1);
                        const nd = nodes[downIdx];
                        if (nd) drawLatticeLink(ctx, n, nd, spacing, isDark, nodeColor);
                    }
                }
            }

            // 5. Render Synaptic Data Pulses
            for (let p = pulses.length - 1; p >= 0; p--) {
                const pulse = pulses[p];
                pulse.progress += dt * pulse.speed;

                const n1 = nodes[pulse.fromNode];
                const n2 = nodes[pulse.toNode];

                if (!n1 || !n2 || pulse.progress >= 1) {
                    if (n2) n2.tension = Math.min(1, n2.tension + 0.35);
                    pulses.splice(p, 1);
                    continue;
                }

                const px = n1.x + (n2.x - n1.x) * pulse.progress;
                const py = n1.y + (n2.y - n1.y) * pulse.progress;

                ctx.fillStyle = isDark ? '#ffffff' : '#000000';
                ctx.beginPath();
                ctx.arc(px, py, 2.0, 0, Math.PI * 2);
                ctx.fill();
            }

            // 6. Render Nodes & HUD Elements
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = focalX - n.x;
                const dy = focalY - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const isNear = dist < focalRadius;

                const currentRadius = isNear
                    ? n.radius * 2.2 + n.tension * 1.5
                    : n.radius + Math.sin(n.pulsePhase) * 0.25;

                if (isNear || n.tension > 0.1) {
                    ctx.fillStyle = `rgba(${accentGlow}, ${Math.min(1, 0.25 + n.tension * 0.65)})`;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, currentRadius * 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.fillStyle = isNear || n.tension > 0.1
                    ? (isDark ? '#ffffff' : '#000000')
                    : `rgba(${nodeColor}, ${isDark ? 0.28 : 0.2})`;

                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                if (showFocalHud && dist < 95) {
                    const radarRing = ((n.pulsePhase * 20) % 32) + 4;
                    const ringAlpha = (1 - radarRing / 36) * 0.38;

                    ctx.strokeStyle = `rgba(${accentGlow}, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, radarRing, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                    ctx.fillStyle = `rgba(${accentGlow}, 0.85)`;
                    ctx.fillText(n.label, n.x + 9, n.y - 9);
                }
            }

            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [isDarkMode]);

    // Mouse Event Handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
        pointerRef.current.lastInteractionTime = performance.now();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        pointerRef.current.isDown = true;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        pointerRef.current.x = x;
        pointerRef.current.y = y;
        pointerRef.current.lastInteractionTime = performance.now();

        shockwavesRef.current.push({
            x,
            y,
            radius: 8,
            maxRadius: 420,
            power: 1.2,
        });
    };

    const handleMouseUp = () => {
        pointerRef.current.isDown = false;
        pointerRef.current.lastInteractionTime = performance.now();
    };

    const handleMouseLeave = () => {
        pointerRef.current.x = -2000;
        pointerRef.current.y = -2000;
        pointerRef.current.isDown = false;
    };

    // Touch Event Handlers (allows smooth scrolling while actively distorting the lattice)
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container || !e.touches[0]) return;

        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        pointerRef.current.isDown = true;
        pointerRef.current.x = x;
        pointerRef.current.y = y;
        pointerRef.current.prevX = x;
        pointerRef.current.prevY = y;
        pointerRef.current.lastInteractionTime = performance.now();

        shockwavesRef.current.push({
            x,
            y,
            radius: 8,
            maxRadius: Math.min(rect.width * 0.9, 380),
            power: 1.3,
        });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container || !e.touches[0]) return;

        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        pointerRef.current.x = touch.clientX - rect.left;
        pointerRef.current.y = touch.clientY - rect.top;
        pointerRef.current.lastInteractionTime = performance.now();
    };

    const handleTouchEnd = () => {
        pointerRef.current.isDown = false;
        pointerRef.current.lastInteractionTime = performance.now();
        setTimeout(() => {
            if (!pointerRef.current.isDown && performance.now() - pointerRef.current.lastInteractionTime >= 250) {
                pointerRef.current.x = -2000;
                pointerRef.current.y = -2000;
            }
        }, 300);
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
            className={cn(
                "group relative flex h-full w-full select-none flex-col justify-between overflow-hidden bg-neutral-50 transition-colors duration-700 dark:bg-[#06070a]",
                className
            )}
        >
            {/* Absolute Edge-to-Edge Canvas Viewport */}
            <canvas
                ref={canvasRef}
                style={{ touchAction: 'pan-y' }}
                className="absolute inset-0 block h-full w-full cursor-crosshair"
            />

            {/* Content Deck Wrapper with Safe Padding */}
            <div className="relative z-20 flex h-full w-full flex-col justify-center p-6 md:p-10 pointer-events-none">
                {/* Center Hero Stencil Typography */}
                <div className="flex flex-col items-center justify-center text-center">
                    <p
                        className={cn(
                            "font-mono text-5xl font-black tracking-tighter uppercase sm:text-7xl md:text-9xl text-neutral-900 dark:text-white",
                            titleClassName
                        )}
                    >
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default KineticMatrix;
