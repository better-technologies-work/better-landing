'use client';
import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  phase: number;
  cluster: 0 | 1;
  vx: number;
  vy: number;
  angle: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface MouseTrail {
  x: number;
  y: number;
  age: number;
}

const PARTICLE_COUNT_DESKTOP = 140;
const PARTICLE_COUNT_MOBILE = 60;
const MOUSE_TRAIL_MAX = 20;
const REST_DUR = 10000;
const FORM_DUR = 3000;
const HOLD_DUR = 1800;
const DISSOLVE_DUR = 2800;

function splatterXY(cx: number, cy: number, spread: number): { x: number; y: number } {
  const r = Math.pow(Math.random(), 0.45) * spread;
  const a = Math.random() * Math.PI * 2;
  const jitter = (Math.random() - 0.5) * spread * 0.35;
  return {
    x: cx + Math.cos(a) * r + jitter,
    y: cy + Math.sin(a) * r + jitter * 0.6,
  };
}

function cubic(
  t: number,
  a: number,
  b: number,
  c: number,
  d: number
): number {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

function spinePoint(
  t: number,
  w: number,
  h: number
): { x: number; y: number; nx: number; ny: number } {
  const p0x = w * 0.08, p0y = h * 0.88;
  const p1x = w * 0.22, p1y = h * 0.35;
  const p2x = w * 0.68, p2y = h * 0.72;
  const p3x = w * 0.92, p3y = h * 0.12;
  const x = cubic(t, p0x, p1x, p2x, p3x);
  const y = cubic(t, p0y, p1y, p2y, p3y);
  const dx =
    3 * (1 - t) * (1 - t) * (p1x - p0x) +
    6 * (1 - t) * t * (p2x - p1x) +
    3 * t * t * (p3x - p2x);
  const dy =
    3 * (1 - t) * (1 - t) * (p1y - p0y) +
    6 * (1 - t) * t * (p2y - p1y) +
    3 * t * t * (p3y - p2y);
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / len, ny: dx / len };
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export default function ParticleWolfBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stRef = useRef<{
    particles: Particle[];
    sparks: Spark[];
    mouseTrail: MouseTrail[];
    mouse: { x: number; y: number; active: boolean };
    phase: 'rest' | 'form' | 'hold' | 'dissolve';
    phaseStart: number;
    lastTime: number;
    animId: number;
    isMobile: boolean;
    w: number;
    h: number;
    dpr: number;
    initialized: boolean;
  }>({
    particles: [],
    sparks: [],
    mouseTrail: [],
    mouse: { x: 0.5, y: 0.5, active: false },
    phase: 'rest',
    phaseStart: 0,
    lastTime: 0,
    animId: 0,
    isMobile: false,
    w: 0,
    h: 0,
    dpr: 1,
    initialized: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const st = stRef.current;
    st.isMobile =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const count = st.isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    const initParticles = () => {
      st.particles = [];
      const cw = st.w || 800;
      const ch = st.h || 600;
      const half = Math.ceil(count / 2);
      const spread = Math.min(cw, ch) * 0.18;
      const centers = [
        { cx: cw * 0.88, cy: ch * 0.12 },
        { cx: cw * 0.12, cy: ch * 0.88 },
      ];
      for (let c = 0; c < 2; c++) {
        const n = c === 0 ? half : count - half;
        for (let i = 0; i < n; i++) {
          const pos = splatterXY(centers[c].cx, centers[c].cy, spread);
          const sz = Math.random() < 0.12
            ? 3 + Math.random() * 5
            : Math.random() < 0.35
              ? 1.5 + Math.random() * 2
              : 0.5 + Math.random() * 1.5;
          st.particles.push({
            x: pos.x,
            y: pos.y,
            homeX: pos.x,
            homeY: pos.y,
            size: sz,
            baseOpacity: 0.15 + Math.random() * 0.55,
            opacity: 0.3,
            phase: Math.random() * Math.PI * 2,
            cluster: c as 0 | 1,
            vx: 0,
            vy: 0,
            angle: 0,
          });
        }
      }
      st.initialized = true;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = rect.width;
      st.h = rect.height;
      canvas.width = Math.round(rect.width * st.dpr);
      canvas.height = Math.round(rect.height * st.dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      if (!st.initialized) initParticles();
    };

    const onMouseMove = (e: MouseEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      st.mouse.x = e.clientX - rect.left;
      st.mouse.y = e.clientY - rect.top;
      st.mouse.active = true;
    };
    const onMouseLeave = () => {
      st.mouse.active = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        st.mouse.x = e.touches[0].clientX - rect.left;
        st.mouse.y = e.touches[0].clientY - rect.top;
        st.mouse.active = true;
      }
    };
    const onTouchEnd = () => {
      st.mouse.active = false;
    };

    resize();
    if (st.w < 1 || st.h < 1) return;

    window.addEventListener('resize', resize);
    const parent = canvas.parentElement;
    parent?.addEventListener('mousemove', onMouseMove);
    parent?.addEventListener('mouseleave', onMouseLeave);
    parent?.addEventListener('touchmove', onTouchMove, { passive: true });
    parent?.addEventListener('touchend', onTouchEnd);

    st.phase = 'rest';
    st.phaseStart = performance.now();
    st.lastTime = performance.now();

    const update = (now: number) => {
      const rawDt = (now - st.lastTime) / 1000;
      const dt = Math.min(rawDt, 0.05);
      st.lastTime = now;
      if (dt <= 0) return;

      const elapsed = now - st.phaseStart;

      if (st.phase === 'rest' && elapsed > REST_DUR) {
        st.phase = 'form';
        st.phaseStart = now;
      } else if (st.phase === 'form' && elapsed > FORM_DUR) {
        st.phase = 'hold';
        st.phaseStart = now;
      } else if (st.phase === 'hold' && elapsed > HOLD_DUR) {
        st.phase = 'dissolve';
        st.phaseStart = now;
      } else if (st.phase === 'dissolve' && elapsed > DISSOLVE_DUR) {
        st.phase = 'rest';
        st.phaseStart = now;
      }

      const formProg = st.phase === 'form' ? easeInOut(Math.min(elapsed / FORM_DUR, 1)) : st.phase === 'hold' || st.phase === 'dissolve' ? 1 : 0;

      for (const p of st.particles) {
        if (formProg > 0) {
          const sp = spinePoint(p.cluster === 0 ? 0.15 : 0.85, st.w, st.h);
          const widthFactor = p.cluster === 0 ? 0.15 : 0.12;
          const perpOff = (Math.random() - 0.5) * 2 * Math.min(st.w, st.h) * widthFactor;
          const tx = sp.x + sp.nx * perpOff;
          const ty = sp.y + sp.ny * perpOff;
          const e = easeInOut(Math.min(formProg * 1.2, 1));
          p.x += (tx - p.x) * e * 0.04 * dt * 60;
          p.y += (ty - p.y) * e * 0.04 * dt * 60;
        } else {
          p.x += (p.homeX - p.x) * 0.02 * dt * 60;
          p.y += (p.homeY - p.y) * 0.02 * dt * 60;
        }

        p.phase += dt * (0.3 + p.size * 0.08);

        if (st.phase === 'dissolve') {
          const dp = Math.min(elapsed / DISSOLVE_DUR, 1);
          const angle = dp * Math.PI * 2.5 + p.phase;
          const radius = dp * 40 * (1 - dp);
          p.x += Math.cos(angle) * radius * dt * 2;
          p.y += Math.sin(angle) * radius * dt * 2;
          p.x += (p.homeX - p.x) * 0.025 * dt * 60;
          p.y += (p.homeY - p.y) * 0.025 * dt * 60;
        }

        if (st.phase === 'rest') {
          const ax = Math.cos(p.phase) * 4;
          const ay = Math.sin(p.phase * 0.7) * 3;
          p.x += (p.homeX + ax - p.x) * 0.015 * dt * 60;
          p.y += (p.homeY + ay - p.y) * 0.015 * dt * 60;
        }

        p.x += p.vx * dt * 0.3;
        p.y += p.vy * dt * 0.3;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.opacity = p.baseOpacity * (0.6 + 0.4 * Math.sin(p.phase));
      }

      if (st.mouse.active && !st.isMobile) {
        st.mouseTrail.unshift({
          x: st.mouse.x,
          y: st.mouse.y,
          age: 0,
        });
        if (st.mouseTrail.length > MOUSE_TRAIL_MAX) st.mouseTrail.pop();
      }
      for (let i = st.mouseTrail.length - 1; i >= 0; i--) {
        st.mouseTrail[i].age += dt;
        if (st.mouseTrail[i].age > 1.0) st.mouseTrail.splice(i, 1);
      }

      if (st.mouse.active && !st.isMobile) {
        const mx = st.mouse.x;
        const my = st.mouse.y;
        for (const p of st.particles) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 100 && dist > 1) {
            const force = (100 - dist) / 100;
            p.vx += (dx / dist) * force * 2;
            p.vy += (dy / dist) * force * 2;
          }
        }
      }

      if (st.phase === 'dissolve') {
        const dp = Math.min(elapsed / DISSOLVE_DUR, 1);
        if (dp < 0.7 && Math.random() < 0.12) {
          st.sparks.push({
            x: Math.random() * st.w,
            y: Math.random() * st.h,
            vx: (Math.random() - 0.5) * 80,
            vy: (Math.random() - 0.5) * 80,
            life: 0,
            maxLife: 0.5 + Math.random() * 0.6,
            size: 1 + Math.random() * 2,
          });
        }
      }
      for (let i = st.sparks.length - 1; i >= 0; i--) {
        const s = st.sparks[i];
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.97;
        s.vy *= 0.97;
        if (s.life >= s.maxLife) st.sparks.splice(i, 1);
      }
    };

    const draw = () => {
      if (st.w < 1 || st.h < 1) return;
      ctx.clearRect(0, 0, st.w, st.h);

      for (let i = 0; i < st.mouseTrail.length; i++) {
        const mt = st.mouseTrail[i];
        const progress = 1 - i / st.mouseTrail.length;
        const alpha = progress * 0.3 * Math.max(0, 1 - mt.age);
        const radius = 2 + progress * 7;
        ctx.beginPath();
        ctx.arc(mt.x, mt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130, 145, 165, ${alpha})`;
        ctx.fill();
      }

      for (const p of st.particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 100, 120, ${p.opacity})`;
        ctx.fill();
        if (p.size > 2.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(90, 100, 120, ${p.opacity * 0.08})`;
          ctx.fill();
        }
      }

      for (const s of st.sparks) {
        const prog = 1 - s.life / s.maxLife;
        const a = Math.min(1, prog * 2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * prog, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 0, ${a * 0.9})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * prog * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 0, ${a * 0.15})`;
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      update(now);
      draw();
      st.animId = requestAnimationFrame(loop);
    };
    st.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(st.animId);
      window.removeEventListener('resize', resize);
      const p = canvas.parentElement;
      p?.removeEventListener('mousemove', onMouseMove);
      p?.removeEventListener('mouseleave', onMouseLeave);
      p?.removeEventListener('touchmove', onTouchMove);
      p?.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
