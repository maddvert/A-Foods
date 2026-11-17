import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame } from 'lucide-react';
import { FOOD_IMAGES } from '../assets/images';

interface SplashScreenProps {
  onComplete: () => void;
}

interface FlyingFoodParticle {
  id: number;
  type: 'image' | 'emoji';
  src?: string;
  emoji?: string;
  label?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotateStart: number;
  rotateEnd: number;
  delay: number;
  duration: number;
  size: number;
}

interface ConfettiSpark {
  id: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
  delay: number;
}

const FLYING_FOOD_ITEMS: FlyingFoodParticle[] = [
  // Flying real food photo medallions bursting outward & upward
  {
    id: 1,
    type: 'image',
    src: FOOD_IMAGES.menuSupremePizza,
    label: 'Pizza',
    startX: 0,
    startY: 0,
    endX: -145,
    endY: -155,
    rotateStart: -35,
    rotateEnd: 12,
    delay: 0.22,
    duration: 2.1,
    size: 62,
  },
  {
    id: 2,
    type: 'image',
    src: FOOD_IMAGES.menuChickenCheeseRoll,
    label: 'Cheese Roll',
    startX: 0,
    startY: 0,
    endX: 145,
    endY: -145,
    rotateStart: 30,
    rotateEnd: -10,
    delay: 0.28,
    duration: 2.1,
    size: 60,
  },
  {
    id: 3,
    type: 'image',
    src: FOOD_IMAGES.menuGolGappay,
    label: 'Gol Gappay',
    startX: 0,
    startY: 0,
    endX: -155,
    endY: 115,
    rotateStart: -20,
    rotateEnd: 15,
    delay: 0.34,
    duration: 2.0,
    size: 56,
  },
  {
    id: 4,
    type: 'image',
    src: FOOD_IMAGES.menuSamosasChapli,
    label: 'Samosa & Kabab',
    startX: 0,
    startY: 0,
    endX: 155,
    endY: 120,
    rotateStart: 25,
    rotateEnd: -14,
    delay: 0.38,
    duration: 2.0,
    size: 58,
  },
  // Flying celebratory fast-food icons bursting across all directions
  {
    id: 5,
    type: 'emoji',
    emoji: '🍕',
    startX: -10,
    startY: 10,
    endX: -90,
    endY: -220,
    rotateStart: -45,
    rotateEnd: 25,
    delay: 0.18,
    duration: 2.2,
    size: 40,
  },
  {
    id: 6,
    type: 'emoji',
    emoji: '🍔',
    startX: 10,
    startY: 10,
    endX: 88,
    endY: -215,
    rotateStart: 40,
    rotateEnd: -20,
    delay: 0.24,
    duration: 2.2,
    size: 38,
  },
  {
    id: 7,
    type: 'emoji',
    emoji: '🌯',
    startX: 0,
    startY: 0,
    endX: -205,
    endY: -35,
    rotateStart: -60,
    rotateEnd: 18,
    delay: 0.3,
    duration: 2.0,
    size: 36,
  },
  {
    id: 8,
    type: 'emoji',
    emoji: '🍟',
    startX: 0,
    startY: 0,
    endX: 205,
    endY: -30,
    rotateStart: 50,
    rotateEnd: -22,
    delay: 0.32,
    duration: 2.0,
    size: 36,
  },
  {
    id: 9,
    type: 'emoji',
    emoji: '🥟',
    startX: 0,
    startY: 0,
    endX: -190,
    endY: -105,
    rotateStart: -30,
    rotateEnd: 30,
    delay: 0.4,
    duration: 1.9,
    size: 32,
  },
  {
    id: 10,
    type: 'emoji',
    emoji: '🥤',
    startX: 0,
    startY: 0,
    endX: 190,
    endY: -95,
    rotateStart: 30,
    rotateEnd: -15,
    delay: 0.42,
    duration: 1.9,
    size: 34,
  },
  {
    id: 11,
    type: 'emoji',
    emoji: '🍗',
    startX: 0,
    startY: 0,
    endX: -85,
    endY: 185,
    rotateStart: -40,
    rotateEnd: 20,
    delay: 0.36,
    duration: 2.0,
    size: 34,
  },
  {
    id: 12,
    type: 'emoji',
    emoji: '🌶️',
    startX: 0,
    startY: 0,
    endX: 90,
    endY: 185,
    rotateStart: 35,
    rotateEnd: -25,
    delay: 0.44,
    duration: 2.0,
    size: 32,
  },
  {
    id: 13,
    type: 'emoji',
    emoji: '🍕',
    startX: 0,
    startY: 0,
    endX: 0,
    endY: -245,
    rotateStart: -20,
    rotateEnd: 20,
    delay: 0.26,
    duration: 2.1,
    size: 36,
  },
  {
    id: 14,
    type: 'emoji',
    emoji: '🎉',
    startX: 0,
    startY: 0,
    endX: -125,
    endY: 165,
    rotateStart: -40,
    rotateEnd: 10,
    delay: 0.2,
    duration: 2.1,
    size: 30,
  },
];

const CONFETTI_SPARKS: ConfettiSpark[] = Array.from({ length: 24 }, (_, idx) => ({
  id: idx,
  angle: (idx * 360) / 24,
  distance: 115 + (idx % 4) * 38,
  color:
    idx % 4 === 0
      ? '#fbbf24'
      : idx % 4 === 1
      ? '#f97316'
      : idx % 4 === 2
      ? '#ef4444'
      : '#fde047',
  size: 5 + (idx % 3) * 3,
  delay: 0.16 + (idx % 5) * 0.06,
}));

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const totalDuration = 2600;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressTimer);
      }
    }, 30);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 150);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0b0d13] text-white select-none px-4"
    >
      {/* Dynamic Atmospheric Glow Backdrop */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.6, 1.25, 1.05], opacity: [0, 0.85, 0.65] }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-red-500/15 blur-[95px] pointer-events-none"
      />

      {/* Skip Intro Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
        onClick={onComplete}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:text-black bg-white/10 hover:bg-amber-400 border border-white/15 rounded-full backdrop-blur-md transition-colors cursor-pointer"
      >
        Skip
      </motion.button>

      {/* Center Stage: Celebration Ring Burst + Flying Fast Food Items + Zooming Bouncing Logo */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md h-[420px] sm:h-[460px]">
        {/* Expanding Celebration Shockwave Rings */}
        {[0, 0.35, 0.7].map((ringDelay, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.25, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{
              duration: 1.6,
              delay: 0.15 + ringDelay,
              ease: 'easeOut',
            }}
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-amber-400/50 pointer-events-none"
          />
        ))}

        {/* Golden Confetti & Sparkle Celebration Burst */}
        {CONFETTI_SPARKS.map((spark) => {
          const rad = (spark.angle * Math.PI) / 180;
          const x = Math.cos(rad) * spark.distance;
          const y = Math.sin(rad) * spark.distance;
          return (
            <motion.span
              key={spark.id}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: [0, x * 0.75, x],
                y: [0, y * 0.75 - 15, y - 35],
                scale: [0, 1.35, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.45,
                delay: spark.delay,
                ease: 'easeOut',
              }}
              style={{
                width: spark.size,
                height: spark.size,
                backgroundColor: spark.color,
              }}
              className="absolute rounded-full shadow-lg pointer-events-none"
            />
          );
        })}

        {/* Flying Fast Food Items Celebration ("fast foods items urte hue") */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {FLYING_FOOD_ITEMS.map((item) => {
            // Scale trajectory slightly for smaller mobile screens so items stay neatly visible
            const mobileScale = typeof window !== 'undefined' && window.innerWidth < 480 ? 0.68 : 1;
            const targetX = item.endX * mobileScale;
            const targetY = item.endY * mobileScale;

            return (
              <motion.div
                key={item.id}
                initial={{
                  x: item.startX,
                  y: item.startY,
                  scale: 0,
                  rotate: item.rotateStart,
                  opacity: 0,
                }}
                animate={{
                  x: [item.startX, targetX * 0.85, targetX],
                  y: [item.startY, targetY - 28, targetY - 42],
                  scale: [0, 1.2, 1, 0.92],
                  rotate: [item.rotateStart, item.rotateEnd, item.rotateEnd + 8],
                  opacity: [0, 1, 1, 0.88],
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute flex items-center justify-center"
              >
                {item.type === 'image' && item.src ? (
                  <div
                    style={{ width: item.size * (mobileScale === 1 ? 1 : 0.84), height: item.size * (mobileScale === 1 ? 1 : 0.84) }}
                    className="rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 shadow-xl shadow-amber-500/30"
                  >
                    <img
                      src={item.src}
                      alt={item.label || 'Fast food'}
                      className="w-full h-full rounded-full object-cover border-2 border-[#0b0d13]"
                    />
                  </div>
                ) : (
                  <span
                    style={{ fontSize: item.size * (mobileScale === 1 ? 1 : 0.85) }}
                    className="drop-shadow-[0_6px_14px_rgba(251,191,36,0.45)]"
                  >
                    {item.emoji}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Center Logo Showcase: Full Zoom-In + Elastic Bounce Celebration */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: 45 }}
          animate={{
            scale: [0, 1.28, 0.86, 1.12, 0.96, 1],
            opacity: [0, 1, 1, 1, 1, 1],
            y: [45, -24, 10, -8, 3, 0],
          }}
          transition={{
            duration: 1.15,
            times: [0, 0.32, 0.52, 0.72, 0.86, 1],
            ease: 'easeOut',
          }}
          className="relative z-20 flex flex-col items-center text-center"
        >
          {/* Animated Emblem Box with Shine Sweep */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              duration: 1.6,
              delay: 1.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-1 shadow-[0_0_55px_rgba(251,191,36,0.55)] flex items-center justify-center overflow-hidden"
          >
            {/* Inner Dark Ring */}
            <div className="w-full h-full rounded-[20px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 flex items-center justify-center relative overflow-hidden">
              <span className="font-display text-5xl sm:text-6xl font-black text-black tracking-tight drop-shadow-sm">
                A
              </span>

              {/* Shimmer Sweep */}
              <motion.div
                initial={{ x: '-140%' }}
                animate={{ x: '220%' }}
                transition={{
                  duration: 1.1,
                  delay: 0.65,
                  repeat: Infinity,
                  repeatDelay: 1.1,
                  ease: 'easeInOut',
                }}
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-25 pointer-events-none"
              />
            </div>
          </motion.div>

          {/* Wordmark Zoom & Bounce */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 20 }}
            animate={{
              scale: [0.4, 1.16, 0.94, 1.03, 1],
              opacity: 1,
              y: [20, -6, 3, 0],
            }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: 'easeOut',
            }}
            className="mt-5 space-y-1.5"
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-400">
                Hot & Fresh Kitchen
              </span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-wider text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              A. <span className="text-amber-400">FOODS</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide flex items-center justify-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Pizza · Samosas · Chaat · Cheese Rolls</span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Progress Loader Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="w-full max-w-xs space-y-2 mt-2 z-20"
      >
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-0.5">
          <span>Firing up the kitchen...</span>
          <span className="text-amber-400 font-bold tabular-nums">{progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden p-[1px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 shadow-[0_0_12px_rgba(251,191,36,0.7)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
