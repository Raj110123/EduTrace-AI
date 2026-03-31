'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { GlowingEffectDemo } from '@/components/ui/glowing-effect-demo';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <BackgroundGradientAnimation containerClassName="min-h-screen">
      <div className="relative z-10 animate-fade-in flex flex-col items-center text-center pt-32 pb-20 max-w-7xl mx-auto px-4">

        <div className="badge badge-blue mb-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 text-white">
          <Sparkles size={14} />
          <span>Powered by Next.js & n8n</span>
        </div>

        <h1 className="page-title text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl text-white">
          Transform Any Video Into An <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300">Interactive Assessment</span>
        </h1>

        <p className="page-description text-xl text-white/80 mb-12 max-w-2xl">
          EduTrace AI instantly turns YouTube lectures into comprehensive quizzes, summaries, and acts as an AI doubt-resolver with exact timestamp context.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-24">
          {loading ? (
            <div className="btn bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 opacity-70">Loading...</div>
          ) : user ? (
            <Link href="/dashboard" className="btn btn-primary px-10 py-4 text-lg flex items-center gap-3 bg-white text-indigo-900 hover:bg-white/90">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link href="/auth/signup" className="btn btn-primary px-10 py-4 text-lg bg-white text-indigo-900 hover:bg-white/90">
                Get Started For Free
              </Link>
              <Link href="/auth/login" className="btn bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 text-lg hover:bg-white/20">
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Features Grid - Now with Glowing Effect & Animated Background! */}
        <div className="w-full mt-12 mb-20 text-left">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Core Features</h2>
          <GlowingEffectDemo />
        </div>

      </div>
    </BackgroundGradientAnimation>
  );
}
