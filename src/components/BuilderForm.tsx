import React from 'react';
import { BuilderRole, CARD_THEMES } from '../types';
import { RefreshCw, Sparkles, User, Code, Briefcase, Palette } from 'lucide-react';

interface BuilderFormProps {
  name: string;
  stack: string;
  role: BuilderRole;
  builderTitle: string;
  themeId: string;
  onNameChange: (val: string) => void;
  onStackChange: (val: string) => void;
  onRoleChange: (val: BuilderRole) => void;
  onRerollTitle: () => void;
  onThemeChange: (themeId: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ROLES: BuilderRole[] = [
  'Developer',
  'Full Stack',
  'Backend',
  'Frontend',
  'AI / ML',
  'Designer',
  'Founder',
  'Student',
  'Engineer',
  'Builder',
  'Security',
  'Product',
];

export const BuilderForm: React.FC<BuilderFormProps> = ({
  name,
  stack,
  role,
  builderTitle,
  themeId,
  onNameChange,
  onStackChange,
  onRoleChange,
  onRerollTitle,
  onThemeChange,
  onSubmit,
  onBack,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="mb-6 border-b border-[#053d28] pb-4">
        <span className="font-mono text-xs text-yellow-400 font-bold">STEP 02 OF 02</span>
        <h2 className="font-space font-extrabold text-2xl sm:text-3xl text-white uppercase mt-0.5">
          BUILDER ID DETAILS
        </h2>
        <p className="font-sans text-sm text-emerald-200/80 mt-1">
          Add your name, stack/role, and tagline for your Goa-ready card.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="bg-[#032b1d] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-lg">
          <label className="block font-mono text-xs uppercase tracking-wider text-emerald-200 font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-[#facc15]" />
            Your Full Name <span className="text-[#facc15]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Harsh Raikwar"
            maxLength={32}
            className="w-full bg-[#021d13] border border-emerald-700/80 focus:border-[#facc15] text-white font-space font-bold text-lg sm:text-xl px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-emerald-800"
          />
        </div>

        {/* Stack Input */}
        <div className="bg-[#032b1d] border border-emerald-800/80 rounded-2xl p-5 space-y-2 shadow-lg">
          <label className="block font-mono text-xs uppercase tracking-wider text-emerald-200 font-bold flex items-center gap-2">
            <Code className="w-4 h-4 text-[#facc15]" />
            What do you build? (Stack / Technologies)
          </label>
          <input
            type="text"
            value={stack}
            onChange={(e) => onStackChange(e.target.value)}
            placeholder="e.g. Nextjs, Nodejs, Django, Flask, Gin, Rust, Tensorflow"
            maxLength={60}
            className="w-full bg-[#021d13] border border-emerald-700/80 focus:border-[#facc15] text-white font-mono text-sm sm:text-base px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-emerald-800"
          />
          <span className="block font-mono text-[11px] text-emerald-300/60">
            Comma-separated chips e.g. Nextjs, Nodejs, Django, Rust
          </span>
        </div>

        {/* Role Selector Chips */}
        <div className="bg-[#032b1d] border border-emerald-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
          <label className="block font-mono text-xs uppercase tracking-wider text-emerald-200 font-bold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#facc15]" />
            Primary Role
          </label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => {
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRoleChange(r)}
                  className={`px-3.5 py-2 font-mono text-xs uppercase rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#facc15] bg-[#facc15] text-black font-bold shadow-md shadow-yellow-500/20'
                      : 'border-emerald-700/80 bg-[#021d13] text-emerald-200 hover:border-emerald-500 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generated Builder Title Banner */}
        <div className="bg-[#033625] border-2 border-[#facc15]/60 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#facc15] font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              BUILDER TAGLINE / QUOTE
            </span>
            <button
              type="button"
              onClick={onRerollTitle}
              className="text-xs font-mono text-white bg-emerald-950 hover:bg-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#facc15]" />
              <span>Re-roll Tagline</span>
            </button>
          </div>

          <div className="bg-[#021d13] border border-emerald-700/80 p-4 rounded-xl text-center">
            <span className="font-sans italic font-semibold text-lg sm:text-xl text-yellow-300 tracking-tight">
              {builderTitle || '"Neural Network Hacker & Prompt Sorcerer"'}
            </span>
          </div>
        </div>

        {/* Card Theme Palette Selector */}
        <div className="bg-[#032b1d] border border-emerald-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
          <label className="block font-mono text-xs uppercase tracking-wider text-emerald-200 font-bold flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#facc15]" />
            CHOOSE YOUR VIBE
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CARD_THEMES.map((theme) => {
              const isSelected = themeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onThemeChange(theme.id)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#facc15] bg-[#facc15]/15 text-white font-bold ring-2 ring-[#facc15]/50'
                      : 'border-emerald-800/80 bg-[#021d13] text-emerald-200 hover:border-emerald-600'
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                      style={{ backgroundColor: theme.cardBg }}
                      title="Card Background"
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                      style={{ backgroundColor: theme.headerLogo }}
                      title="Header Accent"
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-black/50 shadow-sm"
                      style={{ backgroundColor: theme.bracketsColor }}
                      title="Bracket Highlight"
                    />
                  </div>
                  <span className="font-mono text-xs truncate">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#053d28]">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 border border-emerald-700/80 hover:border-emerald-500 text-emerald-200 font-space font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
          >
            BACK
          </button>

          <button
            type="submit"
            disabled={!name.trim()}
            className="px-8 py-3.5 bg-[#facc15] hover:bg-yellow-300 disabled:opacity-50 text-black font-space font-extrabold text-base uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            <span>GENERATE MY PASS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
