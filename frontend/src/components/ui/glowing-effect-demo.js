'use client';

import { useRef, useEffect, useState } from 'react';
import { Brain, Sparkles, MessageSquare, FileText, Zap, Play } from 'lucide-react';

const features = [
  {
    icon: Play,
    title: 'YouTube Integration',
    description: 'Paste any YouTube lecture URL and instantly extract knowledge, transcripts, and key insights.',
    gradient: 'from-red-500/20 to-orange-500/20',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    glowColor: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#ef4444',
  },
  {
    icon: Brain,
    title: 'AI Quiz Generation',
    description: 'Automatically generate comprehensive quizzes and assessments tailored to the video content.',
    gradient: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    iconColor: '#8b5cf6',
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    description: 'Get structured, chapter-by-chapter summaries with key takeaways and learning objectives.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#3b82f6',
  },
  {
    icon: MessageSquare,
    title: 'AI Doubt Resolver',
    description: 'Ask questions and get precise answers with exact video timestamps for direct context.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    glowColor: 'rgba(16, 185, 129, 0.15)',
    iconColor: '#10b981',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Lightning-fast processing pipeline powered by n8n workflows and advanced LLMs.',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#f59e0b',
  },
  {
    icon: Sparkles,
    title: 'Personalized Learning',
    description: 'Adaptive content tailored to your learning pace, style, and educational goals.',
    gradient: 'from-indigo-500/20 to-pink-500/20',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    iconColor: '#6366f1',
  },
];

function GlowingCard({ feature, index }) {
  const cardRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '2px',
        borderRadius: '16px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
      }}
    >
      {/* Glowing border effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: isHovered
            ? `radial-gradient(300px circle at ${mouse.x}px ${mouse.y}px, ${feature.glowColor}, transparent 70%)`
            : 'none',
          zIndex: 0,
        }}
      />

      {/* Card content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '28px',
          borderRadius: '14px',
          border: `1px solid ${isHovered ? feature.borderColor : 'rgba(255,255,255,0.08)'}`,
          background: isHovered
            ? `linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))`
            : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${feature.glowColor}`
            : '0 4px 16px rgba(0,0,0,0.2)',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animationDelay: `${index * 0.1}s`,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${feature.glowColor}, transparent)`,
            border: `1px solid ${feature.borderColor}`,
            flexShrink: 0,
          }}
        >
          <Icon size={22} color={feature.iconColor} />
        </div>

        {/* Text */}
        <div>
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '-0.01em',
            }}
          >
            {feature.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function GlowingEffectDemo() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
      }}
    >
      {features.map((feature, index) => (
        <GlowingCard key={feature.title} feature={feature} index={index} />
      ))}
    </div>
  );
}
