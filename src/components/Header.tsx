import React from 'react';
import { GraduationCap, Signal, Globe, Key } from 'lucide-react';
import { Language } from '../types';
import { i18nDictionary } from '../data/mockData';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenApiModal: () => void;
  isApiConfigured: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenApiModal,
  isApiConfigured
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;

  return (
    <header className="bg-[#0B3C5D] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FDB827] to-[#ffe28a] flex items-center justify-center text-[#0B3C5D] shadow-md font-bold text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  ShikshaSaathi{' '}
                  <span className="text-[#FDB827] text-xs font-black uppercase px-1.5 py-0.5 rounded bg-white/10 tracking-widest border border-amber-300/30">
                    AI
                  </span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  <Signal className="w-3 h-3 text-emerald-300" /> FLN Aligned
                </span>
              </div>
              <p className="text-xs text-sky-200/90 font-normal hidden sm:block">
                {dict.headerTagline}
              </p>
            </div>
          </div>

          {/* Controls: Demo/Live Indicator, Language, API Config */}
          <div className="flex items-center gap-3">
            {/* Live API Key Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isApiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className={isApiConfigured ? 'text-emerald-300 font-medium' : 'text-slate-300'}>
                {isApiConfigured ? 'Live Claude API Connected' : 'Demo Mode (Mock LLM)'}
              </span>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <div className="flex items-center bg-white/10 hover:bg-white/20 transition rounded-lg border border-white/15 px-2.5 py-1.5 text-sm gap-2">
                <Globe className="w-4 h-4 text-[#FDB827]" />
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="en" className="text-slate-900 bg-white">
                    English (EN)
                  </option>
                  <option value="hi" className="text-slate-900 bg-white">
                    हिंदी (Hindi)
                  </option>
                  <option value="gu" className="text-slate-900 bg-white">
                    ગુજરાતી (Gujarati)
                  </option>
                </select>
              </div>
            </div>

            {/* API Key Config Button */}
            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1.5 bg-[#3282B8] hover:bg-[#276e9e] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition active:scale-95 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#FDB827]" />
              <span className="hidden md:inline">{dict.configApiKey}</span>
              <span className="md:hidden">Key</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
