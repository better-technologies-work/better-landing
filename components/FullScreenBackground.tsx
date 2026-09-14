'use client';
import React, { useRef, useEffect } from 'react';

const COUNT = 1800;
const GRID = 50;
const FOCAL = 600;
const M_RADIUS = 200;
const M_FORCE = 4;
const SPRING = 0.025;
const DAMP = 0.9;
const ROT_SPEED = 0.12;
const PHI = (1 + Math.sqrt(5)) / 2;

interface P {
  th: number;
  ph: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  sz: number;
  br: number;
  sx: number;
  sy: number;
  ss: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  sz: number;
}

export default function FullScreenBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    let mx = W / 2;
    let my = H / 2;
    let mOn = false;
    let af = 0;
    let initFrame = 0;
    let lt = performance.now();

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      c.style.width = W + 'px';
      c.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let initialized = false;
    const ps: P[] = [];
    const initializeParticles = () => {
      const particleCount = window.innerWidth < 768 ? 950 : COUNT;
      for (let i = 0; i < particleCount; i++) {
        const t = i * PHI * 2.4;
        const p = i * PHI * 3.7;
        ps.push({
          th: t % (Math.PI * 2),
          ph: p % (Math.PI * 2),
          x: 0, y: 0, z: 0,
          vx: 0, vy: 0, vz: 0,
          sz: 1 + Math.random() * 2.2,
          br: 0.35 + Math.random() * 0.65,
          sx: 0, sy: 0, ss: 1,
        });
      }
      initialized = true;
    };

    let sparks: Spark[] = [];

    const emit = (x: number, y: number) => {
      for (let i = 0; i < 3; i++) {
        sparks.push({
          x, y,
          vx: (Math.random() - 0.5) * 70,
          vy: (Math.random() - 0.5) * 70,
          life: 0,
          max: 0.3 + Math.random() * 0.4,
          sz: 1 + Math.random() * 2,
        });
      }
    };

    const mm = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      mOn = true;
      if (Math.random() < 0.4) emit(mx, my);
    };
    const ml = () => { mOn = false; };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseleave', ml);

    const frame = (now: number) => {
      if (!initialized) {
        af = requestAnimationFrame(frame);
        return;
      }

      const dt = Math.min((now - lt) / 1000, 0.05);
      lt = now;
      const t = now * 0.001;

      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = '#f7f8fa';
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(0,0,0,0.035)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= W; x += GRID) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += GRID) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      const sc = Math.min(W, H) / 650;
      const R = 240 * sc;
      const r = 85 * sc;
      const cx = W / 2;
      const cy = H / 2;
      const rot = t * ROT_SPEED;

      const depth: { i: number; z: number }[] = [];

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        const breath = Math.sin(t * 0.4) * R * 0.08;
        const curR = R + breath;
        const theta = p.th + rot;
        const phi = p.ph + t * 0.25;

        const d1 = Math.sin(theta * 3 + t * 0.6) * 18 * sc;
        const d2 = Math.cos(phi * 2 + t * 0.8) * 14 * sc;
        const d3 = Math.sin((theta + phi) * 1.4 + t) * 10 * sc;

        const bx = (curR + r * Math.cos(p.ph) + d1) * Math.cos(theta);
        const by = (r * Math.sin(p.ph) + d2) * Math.cos(theta * 0.6);
        const bz = (curR + r * Math.cos(p.ph)) * Math.sin(theta) + d3;

        if (mOn) {
          const tx = cx + bx;
          const ty = cy + by;
          const dx = tx - mx;
          const dy = ty - my;
          const d = Math.hypot(dx, dy);
          if (d < M_RADIUS && d > 0.5) {
            const f = (M_RADIUS - d) / M_RADIUS;
            const fm = f * M_FORCE * dt * 60;
            p.vx += (dx / d) * fm;
            p.vy += (dy / d) * fm;
            p.vz += f * 15 * dt * 60;
          }
        }

        p.vx += (0 - p.vx) * SPRING * dt * 60;
        p.vy += (0 - p.vy) * SPRING * dt * 60;
        p.vz += (0 - p.vz) * SPRING * dt * 60;
        p.vx *= DAMP;
        p.vy *= DAMP;
        p.vz *= DAMP;

        p.x = bx + p.vx;
        p.y = by + p.vy;
        p.z = bz + p.vz;

        const z = p.z + 400;
        const s = FOCAL / (FOCAL + z);
        p.sx = cx + p.x * s;
        p.sy = cy + p.y * s;
        p.ss = s;

        depth.push({ i, z: p.z });
      }

      depth.sort((a, b) => a.z - b.z);

      for (const { i } of depth) {
        const p = ps[i];
        const df = Math.max(0.15, Math.min(1, (p.z + 350) / 650));
        const sz = p.sz * p.ss * df;
        const al = p.br * df * 0.75;
        if (sz < 0.25) continue;

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, sz * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,135,165,${al * 0.07})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, sz, 0, Math.PI * 2);
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, sz);
        g.addColorStop(0, `rgba(180,195,220,${al})`);
        g.addColorStop(1, `rgba(100,115,145,${al * 0.6})`);
        ctx.fillStyle = g;
        ctx.fill();
      }

      if (mOn) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
        g.addColorStop(0, 'rgba(255,107,0,0.09)');
        g.addColorStop(0.4, 'rgba(255,107,0,0.04)');
        g.addColorStop(1, 'rgba(255,107,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(mx - 180, my - 180, 360, 360);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 90 * dt;
        const a = Math.max(0, 1 - s.life / s.max);
        if (a <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,140,50,${a * 0.85})`;
        ctx.fill();
      }
      if (sparks.length > 120) sparks = sparks.slice(-120);

      af = requestAnimationFrame(frame);
    };

    initFrame = requestAnimationFrame(() => {
      initializeParticles();
      af = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(initFrame);
      cancelAnimationFrame(af);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseleave', ml);
    };
  }, []);

  return (
    <canvas
      id="bg-canvas"
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
