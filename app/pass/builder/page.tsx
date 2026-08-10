import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CardPreview } from '../../../src/components/CardPreview';
import { BuilderDetails } from '../../../src/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    name?: string;
    role?: string;
    photo?: string;
    title?: string;
    stack?: string;
    theme?: string;
    cardNo?: string;
    passType?: string;
    teammates?: string;
  }>;
}

// Dynamic OpenGraph/Twitter Metadata generation
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const name = params.name || 'Builder';
  const role = params.role || 'Developer';
  const photo = params.photo || '';
  const title = params.title || '"Code on the Coast • Ship to the World"';
  const stack = params.stack || 'React, Node, AI';
  const theme = params.theme || 'vintage-goa';

  const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://hhgoa-tau.vercel.app';
  const passType = params.passType || 'single';
  const teammates = params.teammates || '';
  
  // Build query params specifically for /api/og
  const ogParams = new URLSearchParams({
    name,
    role,
    title,
    stack,
    photo,
    theme,
    passType,
    teammates,
  });
  
  const absoluteOgImageUrl = `${host}/api/og?${ogParams.toString()}`;

  return {
    title: `${name}'s HH Goa 2026 Builder Pass [ ${role} ]`,
    description: `${name}'s official Builder Passport for Hacker House Goa 2026. #FrameInGoa`,
    openGraph: {
      type: 'website',
      title: `${name}'s HH Goa 2026 Builder Pass — ${role}`,
      description: `Join us in Goa. 🌴 #FrameInGoa #HHGoa2026`,
      images: [
        {
          url: absoluteOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${name}'s Builder Pass`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — ${role} | HH Goa 2026 Pass`,
      description: `See you in Goa. 🌴 #FrameInGoa #HHGoa2026`,
      images: [absoluteOgImageUrl],
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const name = params.name || 'Harsh Raikwar';
  const role = params.role || 'AI / ML';
  const photo = params.photo || '';
  const title = params.title || '"Neural Network Hacker & Prompt Sorcerer"';
  const stack = params.stack || 'Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow';
  const theme = params.theme || 'vintage-goa';
  const cardNo = params.cardNo || 'HH26-3E3BA58';

  const passType = params.passType || 'single';
  let teammates: any[] = [];
  if (passType === 'team' && params.teammates) {
    try {
      teammates = JSON.parse(params.teammates);
    } catch (err) {
      console.error('Failed to parse teammates query param on pass page:', err);
    }
  }

  const builderDetails: BuilderDetails = {
    id: cardNo,
    name,
    role,
    photoUrl: photo,
    builderTitle: title,
    stack,
    themeId: theme,
    cardNumber: cardNo,
    photoTransform: { zoom: 1, panX: 0, panY: 0, rotation: 0, filter: 'none' },
    createdAt: new Date().toISOString(),
    passType: passType as 'single' | 'team',
    teammates: teammates,
  };

  return (
    <div className="min-h-screen bg-[#070d0a] text-[#f2efe9] font-sans antialiased flex flex-col justify-between p-4 sm:p-8">
      {/* Header Banner */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-emerald-900/60 pb-6 mb-8 mt-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#facc15] text-black font-mono font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Builder Pass
          </span>
          <span className="font-mono text-xs text-emerald-400 hidden sm:inline">
            ID: {cardNo}
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-mono text-yellow-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Create Your Own Pass</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 my-auto">
        <div className="text-center space-y-2">
          <h1 className="font-space font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            {name}'s Builder Passport 🌴
          </h1>
          <p className="font-mono text-sm text-pink-400 font-semibold max-w-lg mx-auto">
            » {role} • {title}
          </p>
        </div>

        {/* Card render */}
        <div className="w-full max-w-[620px] p-4 sm:p-6 bg-[#080d0b] rounded-3xl border border-emerald-900/80 shadow-2xl flex items-center justify-center">
          <CardPreview details={builderDetails} />
        </div>

        {/* CTA Call-to-action */}
        <div className="w-full max-w-[620px] bg-[#0e1512] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
          <div className="space-y-2">
            <h2 className="font-space font-extrabold text-xl sm:text-2xl text-white">
              Want your own Hacker House Goa Pass?
            </h2>
            <p className="font-sans text-sm text-emerald-300/80 leading-relaxed">
              Design your customized builder pass with your profile picture, tech stack, and dynamic sharing.
            </p>
          </div>

          <div className="flex items-center justify-center pt-2">
            <Link
              href="/"
              className="w-full py-4 px-8 bg-gradient-to-r from-[#facc15] via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-black font-space font-black text-sm uppercase rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-black" />
              <span>Create Your Own Card</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center font-mono text-xs text-emerald-400/50 py-8 mt-12 border-t border-emerald-900/40">
        HACKER HOUSE GOA 2026 • OFFICIAL BUILDER PASSPORT STUDIO
      </footer>
    </div>
  );
}
