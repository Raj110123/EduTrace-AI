'use client';

import { useEffect, useRef } from 'react';

export function BackgroundGradientAnimation({
  children,
  containerClassName = '',
  gradientBackgroundStart = 'rgb(30, 20, 80)',
  gradientBackgroundEnd = 'rgb(15, 10, 50)',
  firstColor = '99, 102, 241',
  secondColor = '139, 92, 246',
  thirdColor = '59, 130, 246',
  fourthColor = '168, 85, 247',
  fifthColor = '79, 70, 229',
  pointerColor = '120, 100, 230',
  size = '80%',
  blendingValue = 'hard-light',
  interactive = true,
}) {
  const interactiveRef = useRef(null);
  const containerRef = useRef(null);

  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.style.setProperty('--gradient-background-start', gradientBackgroundStart);
    el.style.setProperty('--gradient-background-end', gradientBackgroundEnd);
    el.style.setProperty('--first-color', firstColor);
    el.style.setProperty('--second-color', secondColor);
    el.style.setProperty('--third-color', thirdColor);
    el.style.setProperty('--fourth-color', fourthColor);
    el.style.setProperty('--fifth-color', fifthColor);
    el.style.setProperty('--pointer-color', pointerColor);
    el.style.setProperty('--size', size);
    el.style.setProperty('--blending-value', blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      curX.current += (tgX.current - curX.current) / 20;
      curY.current += (tgY.current - curY.current) / 20;
      interactiveRef.current.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(curY.current)}px)`;
      requestAnimationFrame(move);
    }

    move();
  }, []);

  const handleMouseMove = (event) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    tgX.current = event.clientX - rect.left - rect.width / 2;
    tgY.current = event.clientY - rect.top - rect.height / 2;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`bga-container ${containerClassName}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
      }}
    >
      {/* Animated gradient orbs */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          filter: 'blur(80px)',
          opacity: 0.8,
        }}
      >
        {/* Orb 1 */}
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            top: '10%',
            left: '10%',
            background: `radial-gradient(circle at center, rgba(${firstColor}, 0.8) 0%, rgba(${firstColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
            animation: 'bgaMoveFirst 15s infinite alternate ease-in-out',
          }}
        />
        {/* Orb 2 */}
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            top: '50%',
            left: '60%',
            background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0%, rgba(${secondColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
            animation: 'bgaMoveSecond 18s infinite alternate ease-in-out',
          }}
        />
        {/* Orb 3 */}
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            top: '30%',
            left: '30%',
            background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0%, rgba(${thirdColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
            animation: 'bgaMoveThird 20s infinite alternate ease-in-out',
          }}
        />
        {/* Orb 4 */}
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            top: '70%',
            left: '20%',
            background: `radial-gradient(circle at center, rgba(${fourthColor}, 0.8) 0%, rgba(${fourthColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
            animation: 'bgaMoveFourth 22s infinite alternate ease-in-out',
          }}
        />
        {/* Orb 5 */}
        <div
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            top: '20%',
            left: '70%',
            background: `radial-gradient(circle at center, rgba(${fifthColor}, 0.8) 0%, rgba(${fifthColor}, 0) 70%)`,
            mixBlendMode: blendingValue,
            animation: 'bgaMoveFifth 25s infinite alternate ease-in-out',
          }}
        />
        {/* Interactive pointer orb */}
        {interactive && (
          <div
            ref={interactiveRef}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              width: '40%',
              height: '40%',
              top: 'calc(50% - 20%)',
              left: 'calc(50% - 20%)',
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.6) 0%, rgba(${pointerColor}, 0) 70%)`,
              mixBlendMode: blendingValue,
              transition: 'transform 0.1s',
            }}
          />
        )}
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes bgaMoveFirst {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 15%) scale(1.1); }
          66% { transform: translate(-5%, 10%) scale(0.95); }
          100% { transform: translate(5%, -10%) scale(1.05); }
        }
        @keyframes bgaMoveSecond {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-15%, -10%) scale(1.15); }
          66% { transform: translate(10%, -5%) scale(0.9); }
          100% { transform: translate(-5%, 15%) scale(1.1); }
        }
        @keyframes bgaMoveThird {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15%, -15%) scale(1.05); }
          66% { transform: translate(-10%, 10%) scale(1.1); }
          100% { transform: translate(10%, 5%) scale(0.95); }
        }
        @keyframes bgaMoveFourth {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10%, 20%) scale(1.1); }
          66% { transform: translate(15%, -5%) scale(0.95); }
          100% { transform: translate(-15%, -15%) scale(1.05); }
        }
        @keyframes bgaMoveFifth {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20%, 10%) scale(0.9); }
          66% { transform: translate(-15%, -15%) scale(1.15); }
          100% { transform: translate(5%, 20%) scale(1); }
        }
      `}</style>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
