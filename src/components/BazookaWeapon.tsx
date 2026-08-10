import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../lib/audio';

interface BazookaWeaponProps {
  active: boolean;
  onDestroyElement: (id: string) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  rotation?: number;
  rotationSpeed?: number;
  type: 'smoke' | 'fire' | 'debris' | 'spark';
  gravity?: boolean;
}

interface Missile {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  speed: number;
  angle: number;
  distance: number;
  traveled: number;
}

export const BazookaWeapon: React.FC<BazookaWeaponProps> = ({ active, onDestroyElement }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [recoil, setRecoil] = useState({ x: 0, y: 0 });
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const [ammoCount, setAmmoCount] = useState(5); // pure visual ammo counter
  
  const requestRef = useRef<number | null>(null);
  
  // Refs for arrays to avoid re-triggering effects on state changes
  const missilesRef = useRef<Missile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const particleIdRef = useRef(0);
  const missileIdRef = useRef(0);

  // Bazooka anchor point (bottom right area of screen)
  const getAnchorPoint = () => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return {
      x: window.innerWidth - 120,
      y: window.innerHeight - 100
    };
  };

  const anchor = getAnchorPoint();
  
  // Calculate angle between anchor and mouse
  const dx = mousePos.x - anchor.x;
  const dy = mousePos.y - anchor.y;
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  // Listen to mouse movement to rotate bazooka
  useEffect(() => {
    if (!active) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);

  // Intercept all page clicks to fire missile instead
  useEffect(() => {
    if (!active) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('header') || 
        target.closest('.rebuild-btn') || 
        target.closest('[data-bazooka-bypass]')
      ) {
        return;
      }

      // Prevent click from affecting forms, inputs, buttons
      e.preventDefault();
      e.stopPropagation();
      
      fireMissile(e.clientX, e.clientY);
    };

    // Use capturing phase so we grab clicks before they hit form fields
    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [active, mousePos]);

  // Firing function
  const fireMissile = (targetX: number, targetY: number) => {
    const launchPoint = {
      x: anchor.x + Math.cos(angleRad) * 120,
      y: anchor.y + Math.sin(angleRad) * 120
    };

    const distDx = targetX - launchPoint.x;
    const distDy = targetY - launchPoint.y;
    const distance = Math.sqrt(distDx * distDx + distDy * distDy);

    // Don't fire if too close to barrel
    if (distance < 30) return;

    // Recoil kickback
    const recoilForce = -25;
    setRecoil({
      x: Math.cos(angleRad) * recoilForce,
      y: Math.sin(angleRad) * recoilForce
    });

    // Muzzle flash visual trigger
    setMuzzleFlash(true);
    setTimeout(() => setMuzzleFlash(false), 80);

    // Play visual reload
    setAmmoCount(prev => (prev > 1 ? prev - 1 : 5));

    // Play synthesized launch sound
    playSound('launch');

    // Spawn missile
    const newMissile: Missile = {
      id: missileIdRef.current++,
      startX: launchPoint.x,
      startY: launchPoint.y,
      targetX,
      targetY,
      currentX: launchPoint.x,
      currentY: launchPoint.y,
      speed: 16, // pixels per frame
      angle: angleRad,
      distance,
      traveled: 0
    };

    missilesRef.current.push(newMissile);

    // Initial launch sparks
    for (let i = 0; i < 15; i++) {
      const sparkAngle = angleRad + (Math.random() - 0.5) * 0.6;
      const sparkSpeed = 3 + Math.random() * 5;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: launchPoint.x,
        y: launchPoint.y,
        vx: Math.cos(sparkAngle) * sparkSpeed + (Math.random() - 0.5) * 2,
        vy: Math.sin(sparkAngle) * sparkSpeed + (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.04 + Math.random() * 0.04,
        color: Math.random() > 0.3 ? '#facc15' : '#ef4444',
        type: 'spark'
      });
    }
  };

  // Screen shake effect helper
  const triggerScreenShake = () => {
    const mainEl = document.querySelector('main') || document.body;
    mainEl.classList.remove('screen-shake');
    // Trigger reflow to restart animation
    void mainEl.offsetWidth;
    mainEl.classList.add('screen-shake');
  };

  // Shatter an element in particle system
  const shatterElement = (element: Element, targetX: number, targetY: number) => {
    const rect = element.getBoundingClientRect();
    
    // Debris color selection based on element colors or preset theme palette
    const colors = ['#facc15', '#10b981', '#064e3b', '#f2efe9', '#047857', '#34d399', '#78716c'];
    
    const count = 35 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      // Spawn particles distributed across bounding box
      const pX = rect.left + Math.random() * rect.width;
      const pY = rect.top + Math.random() * rect.height;

      // Blast direction away from explosion center
      const blastDx = pX - targetX;
      const blastDy = pY - targetY;
      const dist = Math.sqrt(blastDx * blastDx + blastDy * blastDy) || 1;
      
      const force = 3 + Math.random() * 8;
      const vx = (blastDx / dist) * force + (Math.random() - 0.5) * 3;
      const vy = (blastDy / dist) * force - (Math.random() * 4); // blast up

      particlesRef.current.push({
        id: particleIdRef.current++,
        x: pX,
        y: pY,
        vx,
        vy,
        size: 3 + Math.random() * 7,
        alpha: 1,
        decay: 0.01 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        type: 'debris',
        gravity: true
      });
    }
  };

  // Collision detection logic
  const handleExplosion = (targetX: number, targetY: number) => {
    // 1. Trigger screen shake
    triggerScreenShake();

    // Play explosion sound effect
    playSound('explosion');

    // 2. Explode particles
    // Large fireballs
    for (let i = 0; i < 15; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = 2 + Math.random() * 5;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: targetX,
        y: targetY,
        vx: Math.cos(pAngle) * pSpeed,
        vy: Math.sin(pAngle) * pSpeed,
        size: 15 + Math.random() * 25,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
        type: 'fire'
      });
    }

    // Spark shower
    for (let i = 0; i < 25; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = 4 + Math.random() * 7;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: targetX,
        y: targetY,
        vx: Math.cos(pAngle) * pSpeed,
        vy: Math.sin(pAngle) * pSpeed - 1, // upward drift
        size: 2 + Math.random() * 4,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
        color: '#facc15',
        type: 'spark'
      });
    }

    // Heavy grey smoke puff
    for (let i = 0; i < 10; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = 0.5 + Math.random() * 2;
      particlesRef.current.push({
        id: particleIdRef.current++,
        x: targetX + (Math.random() - 0.5) * 15,
        y: targetY + (Math.random() - 0.5) * 15,
        vx: Math.cos(pAngle) * pSpeed,
        vy: Math.sin(pAngle) * pSpeed - 0.5,
        size: 25 + Math.random() * 30,
        alpha: 0.8,
        decay: 0.01 + Math.random() * 0.01,
        color: '#374151',
        type: 'smoke'
      });
    }

    // 3. Find hit targetable element
    const hitElements = document.elementsFromPoint(targetX, targetY);
    for (const el of hitElements) {
      const targetable = el.closest('.targetable-element');
      if (targetable) {
        const destroyId = targetable.getAttribute('data-destroy-id');
        if (destroyId && !targetable.classList.contains('element-destroyed')) {
          shatterElement(targetable, targetX, targetY);
          onDestroyElement(destroyId);
          break; // destroy only one element per rocket
        }
      }
    }
  };

  // Main animation frame loop
  const updateFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas dynamically to match window
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // A. Update recoil transition back to rest position (0, 0)
    setRecoil(prev => ({
      x: prev.x * 0.85,
      y: prev.y * 0.85
    }));

    // B. Update and render missiles
    const missiles = missilesRef.current;
    for (let i = missiles.length - 1; i >= 0; i--) {
      const m = missiles[i];
      m.traveled += m.speed;
      
      const t = Math.min(1, m.traveled / m.distance);
      m.currentX = m.startX + (m.targetX - m.startX) * t;
      m.currentY = m.startY + (m.targetY - m.startY) * t;

      // Spawn trail smoke particles
      if (Math.random() > 0.1) {
        particlesRef.current.push({
          id: particleIdRef.current++,
          x: m.currentX,
          y: m.currentY,
          vx: -Math.cos(m.angle) * 1.5 + (Math.random() - 0.5),
          vy: -Math.sin(m.angle) * 1.5 + (Math.random() - 0.5),
          size: 6 + Math.random() * 8,
          alpha: 0.6,
          decay: 0.02 + Math.random() * 0.02,
          color: Math.random() > 0.8 ? '#4b5563' : '#6b7280',
          type: 'smoke'
        });
        
        // Spark trail
        if (Math.random() > 0.5) {
          particlesRef.current.push({
            id: particleIdRef.current++,
            x: m.currentX,
            y: m.currentY,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            size: 1.5 + Math.random() * 2,
            alpha: 1,
            decay: 0.05 + Math.random() * 0.05,
            color: '#facc15',
            type: 'spark'
          });
        }
      }

      // Check impact
      if (t >= 1) {
        handleExplosion(m.targetX, m.targetY);
        missiles.splice(i, 1);
        continue;
      }

      // Draw rocket missile
      ctx.save();
      ctx.translate(m.currentX, m.currentY);
      ctx.rotate(m.angle);
      
      // Rocket Fire tail flame
      const grad = ctx.createLinearGradient(-35, 0, 0, 0);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.9)');
      grad.addColorStop(0.8, 'rgba(250, 204, 21, 1)');
      grad.addColorStop(1, '#ffffff');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-35, 0);
      ctx.lineTo(-10, -6);
      ctx.lineTo(0, 0);
      ctx.lineTo(-10, 6);
      ctx.closePath();
      ctx.fill();

      // Rocket body
      ctx.fillStyle = '#ef4444'; // Red shell
      ctx.beginPath();
      ctx.moveTo(-10, -3);
      ctx.lineTo(8, -3);
      ctx.lineTo(14, 0);
      ctx.lineTo(8, 3);
      ctx.lineTo(-10, 3);
      ctx.closePath();
      ctx.fill();
      
      // Yellow fin wings
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-10, -6, 3, 3);
      ctx.fillRect(-10, 3, 3, 3);

      ctx.restore();
    }

    // C. Update and render particles
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Physics apply
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.gravity) {
        p.vy += 0.28; // downward gravity
      }

      // Rotation for debris
      if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
        p.rotation += p.rotationSpeed;
      }

      p.alpha -= p.decay;

      // Clean up dead particles
      if (p.alpha <= 0 || p.size <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Render particle depending on type
      ctx.save();
      ctx.globalAlpha = p.alpha;
      
      if (p.type === 'smoke') {
        ctx.fillStyle = p.color;
        // Smoke swells outwards
        const currentSize = p.size * (2 - p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'fire') {
        // Fire is vibrant yellow-orange radial gradient
        const radGrad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.size / 2);
        radGrad.addColorStop(0, '#ffffff');
        radGrad.addColorStop(0.2, '#facc15'); // Yellow core
        radGrad.addColorStop(0.6, '#ef4444'); // Red outer
        radGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'debris') {
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        if (p.rotation !== undefined) {
          ctx.rotate(p.rotation);
        }
        // Draw little rectangular shatter shards
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.type === 'spark') {
        // Glowing sparks
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // D. Render muzzle flash on canvas
    if (muzzleFlash) {
      const launchPoint = {
        x: anchor.x + Math.cos(angleRad) * 115,
        y: anchor.y + Math.sin(angleRad) * 115
      };

      ctx.save();
      const flashGrad = ctx.createRadialGradient(
        launchPoint.x, launchPoint.y, 2,
        launchPoint.x, launchPoint.y, 45
      );
      flashGrad.addColorStop(0, '#ffffff');
      flashGrad.addColorStop(0.3, '#f59e0b');
      flashGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.4)');
      flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = flashGrad;
      ctx.beginPath();
      ctx.arc(launchPoint.x, launchPoint.y, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestRef.current = requestAnimationFrame(updateFrame);
  };

  // Start animation loop when component mounts / is active
  useEffect(() => {
    if (active) {
      requestRef.current = requestAnimationFrame(updateFrame);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active, mousePos, recoil, muzzleFlash]);

  if (!active) return null;

  return (
    <>
      {/* Target Crosshair Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        style={{
          cursor: 'crosshair',
        }}
      />

      {/* Physics & Blast Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
      />

      {/* Aiming Reticle Circle following the mouse cursor */}
      <div
        className="fixed pointer-events-none z-[70] w-12 h-12 border-2 border-dashed border-[#ef4444]/60 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.25)',
        }}
      >
        <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full" />
      </div>

      {/* High-quality Bazooka Model SVG */}
      <div
        className="fixed pointer-events-none z-[100] drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
        style={{
          bottom: 0,
          right: 0,
          width: '280px',
          height: '200px',
          transformOrigin: '75% 75%', // grip anchor point
          transform: `translate(${recoil.x}px, ${recoil.y}px) rotate(${angleDeg}deg)`,
          transition: recoil.x !== 0 || recoil.y !== 0 ? 'none' : 'transform 0.08s cubic-bezier(0.1, 0.8, 0.3, 1)',
        }}
      >
        <svg
          viewBox="0 0 320 200"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="bazookaBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="40%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1f2937" />
            </linearGradient>
            <linearGradient id="metallicGreen" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="neonGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
            <linearGradient id="ironPlate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
          </defs>

          {/* 1. Shoulder Rest (Rear Stock) */}
          <path
            d="M 230 115 L 285 110 L 295 160 L 255 165 Z"
            fill="url(#bazookaBody)"
            stroke="#111"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M 285 118 L 293 154" stroke="#ef4444" strokeWidth="3" />

          {/* 2. Handgrip & Trigger Guard */}
          <path
            d="M 205 130 L 220 185 L 205 188 L 192 135"
            fill="#111"
            stroke="#000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Trigger */}
          <path d="M 188 145 Q 196 150 196 142" stroke="#facc15" strokeWidth="3.5" fill="none" />
          <path d="M 183 135 H 198 V 153 H 183 Z" stroke="#374151" strokeWidth="2.5" />

          {/* 3. Main Launcher Tube */}
          <rect
            x="45"
            y="95"
            width="200"
            height="36"
            rx="4"
            fill="url(#bazookaBody)"
            stroke="#111"
            strokeWidth="4"
          />

          {/* 4. Barrel Reinforcement Bands (Metallic Stripes) */}
          <rect x="55" y="94" width="8" height="38" fill="url(#ironPlate)" stroke="#111" strokeWidth="2" />
          <rect x="110" y="94" width="10" height="38" fill="url(#ironPlate)" stroke="#111" strokeWidth="2" />
          <rect x="180" y="94" width="8" height="38" fill="url(#ironPlate)" stroke="#111" strokeWidth="2" />

          {/* Yellow/Black Warning Stripes (Hazard decals) */}
          <g>
            <path d="M 68 97 L 76 128" stroke="#facc15" strokeWidth="3" />
            <path d="M 76 97 L 84 128" stroke="#111" strokeWidth="3" />
            <path d="M 84 97 L 92 128" stroke="#facc15" strokeWidth="3" />
          </g>

          {/* 5. Glow Core Chamber */}
          <rect
            x="128"
            y="102"
            width="42"
            height="22"
            rx="3"
            fill="#064e3b"
            stroke="#111"
            strokeWidth="2"
          />
          {/* Energy core glow line */}
          <rect
            x="132"
            y="108"
            width="34"
            height="10"
            rx="1.5"
            fill="url(#neonGlow)"
            className="animate-pulse"
          />

          {/* 6. Targeting Scope (Optic) */}
          <path
            d="M 130 95 L 140 70 H 185 L 195 95 Z"
            fill="#1f2937"
            stroke="#111"
            strokeWidth="3.5"
          />
          {/* Scope lens glow */}
          <circle cx="145" cy="80" r="6" fill="#34d399" />
          <circle cx="180" cy="80" r="7" fill="#6ee7b7" />
          <line x1="145" y1="70" x2="180" y2="70" stroke="#111" strokeWidth="3" />

          {/* 7. Front Muzzle Cover (Trumpet shape barrel exit) */}
          <path
            d="M 45 92 L 20 84 V 142 L 45 134 Z"
            fill="url(#bazookaBody)"
            stroke="#111"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Neon charging tip */}
          <path
            d="M 22 88 L 27 92 V 134 L 22 138 Z"
            fill="url(#metallicGreen)"
          />

          {/* 8. Active Mode Status Decal */}
          <text
            x="205"
            y="120"
            fill="#10b981"
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
          />

          {/* Visual ammo light dots */}
          <g>
            <circle cx="215" cy="104" r="2.5" fill={ammoCount >= 1 ? '#34d399' : '#374151'} />
            <circle cx="223" cy="104" r="2.5" fill={ammoCount >= 2 ? '#34d399' : '#374151'} />
            <circle cx="231" cy="104" r="2.5" fill={ammoCount >= 3 ? '#34d399' : '#374151'} />
            <circle cx="239" cy="104" r="2.5" fill={ammoCount >= 4 ? '#34d399' : '#374151'} />
          </g>
        </svg>
      </div>
      
      {/* Interactive Weapon Controls Floating Notice */}
      <div className="fixed bottom-6 left-6 z-[80] bg-[#0c1310]/95 border-2 border-[#ef4444] rounded-2xl px-5 py-4 max-w-sm shadow-2xl backdrop-blur-md animate-bounce">
        <div className="flex items-start gap-3">
          <div className="text-xl">💥</div>
          <div>
            <h4 className="font-space font-extrabold text-sm text-white uppercase tracking-wider">
              Bazooka Mode Active!
            </h4>
            <p className="font-mono text-[11px] text-[#ef4444]/90 mt-1 leading-normal">
              Click anywhere to fire. Target form components to vaporize them!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
