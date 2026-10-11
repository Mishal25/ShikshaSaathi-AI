import React, { useState, useRef } from 'react';
import {
  Users,
  RotateCcw,
  FileText,
  Copy,
  Printer,
  Sparkles,
  Check
} from 'lucide-react';
import { Language, GroupTier } from '../types';
import { i18nDictionary } from '../data/mockData';
import { callAI } from '../services/aiService';

interface GroupingTabProps {
  currentLanguage: Language;
  onShowToast: (msg: string) => void;
  onSelectStudentKey?: (key: string) => void;
  onNavigateToAssessment?: () => void;
}

export const GroupingTab: React.FC<GroupingTabProps> = ({
  currentLanguage,
  onShowToast
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;

  const [activeGroupTier, setActiveGroupTier] = useState<GroupTier | null>('B');
  const [worksheetContent, setWorksheetContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const worksheetRef = useRef<HTMLDivElement>(null);

  const handleGenerateWorksheet = async (tier: GroupTier) => {
    setActiveGroupTier(tier);
    setIsGenerating(true);
    setWorksheetContent(null);
    onShowToast(`Generating customized worksheet for Group ${tier}...`);

    const prompt = `Generate a printable, 10-minute classroom worksheet for Group ${tier} in a Grade 3 Indian primary school.
- Group A: Level 1 (Foundational Remedial: single letters, phonics matching, numbers 1-20, counting objects).
- Group B: Level 2 (Intermediate: 3-letter words with matras, fill in missing letters, 2-digit addition without carry).
- Group C: Level 3 (Advanced: short reading comprehension paragraph with 2 questions, 2-digit subtraction with borrow).
Language: Bilingual (Gujarati/Hindi and English).
Format nicely with clear printable question numbers, blanks (___), and a 1-sentence Teacher Guidance tip.`;

    try {
      const response = await callAI(prompt);
      setWorksheetContent(response);
      onShowToast(`Worksheet for Group ${tier} generated!`);
      // Scroll to worksheet display
      setTimeout(() => {
        worksheetRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      onShowToast('Could not generate worksheet. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!worksheetContent) return;
    navigator.clipboard.writeText(worksheetContent).then(() => {
      setCopied(true);
      onShowToast('Worksheet text copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRecluster = () => {
    onShowToast('Re-clustering students based on latest diagnostic scores...');
    setTimeout(() => {
      onShowToast('TaRL groups re-balanced successfully!');
    }, 600);
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">{dict.groupingModuleTitle}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{dict.groupingModuleSub}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecluster}
            className="text-xs bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-cluster Groups
          </button>
        </div>
      </div>

      {/* 3 Tier Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Group A: Foundational Support */}
        <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-rose-50 px-4 py-3 border-b border-rose-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-rose-900 text-sm">Group A: Foundational</h3>
                <span className="text-[11px] text-rose-600 font-semibold">
                  Remedial Support • Level 1
                </span>
              </div>
              <span className="text-xs font-black bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                8 Students
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-700">Target Focus:</span> Single letter sounds,
                akshar recognition, number tracing (1-20), concrete addition using fingers.
              </div>
              {/* Student chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Assigned Students:
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['Aarav Patel', 'Priya Solanki', 'Dhaval', 'Geeta', 'Ramesh', '+3 more'].map(
                    (st, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 hover:bg-rose-100 text-slate-700 px-2 py-0.5 rounded font-medium cursor-default transition"
                      >
                        {st}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => handleGenerateWorksheet('A')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Generate Group A Worksheet
            </button>
          </div>
        </div>

        {/* Group B: Intermediate Practice */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-amber-900 text-sm">Group B: Intermediate</h3>
                <span className="text-[11px] text-amber-600 font-semibold">
                  Core Practice • Level 2
                </span>
              </div>
              <span className="text-xs font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                18 Students
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-700">Target Focus:</span> 3-letter words with
                matras, simple 1-digit word problems, 2-digit addition without carry.
              </div>
              {/* Student chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Assigned Students:
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['Rahul Sharma', 'Neha', 'Vikram', 'Karan', 'Sunita K.', '+13 more'].map(
                    (st, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 hover:bg-amber-100 text-slate-700 px-2 py-0.5 rounded font-medium cursor-default transition"
                      >
                        {st}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => handleGenerateWorksheet('B')}
              className="w-full bg-[#0B3C5D] hover:bg-[#154c74] text-white py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Generate Group B Worksheet
            </button>
          </div>
        </div>

        {/* Group C: Advanced Mastery */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-emerald-900 text-sm">Group C: Advanced</h3>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  Mastery & Enrichment • Level 3
                </span>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                9 Students
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-700">Target Focus:</span> Reading comprehension
                paragraphs, 2-digit subtraction with borrowing, word problem construction.
              </div>
              {/* Student chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Assigned Students:
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['Meera Joshi', 'Kabir Verma', 'Ananya', 'Tejas', 'Rohit', '+4 more'].map(
                    (st, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 hover:bg-emerald-100 text-slate-700 px-2 py-0.5 rounded font-medium cursor-default transition"
                      >
                        {st}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={() => handleGenerateWorksheet('C')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Generate Group C Worksheet
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic AI Worksheet Display Area */}
      {(isGenerating || worksheetContent) && (
        <div
          ref={worksheetRef}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-extrabold text-slate-800 text-base">
                  {isGenerating
                    ? `Synthesizing 10-Minute Activity Sheet (Group ${activeGroupTier})...`
                    : `Generated 10-Minute Classroom Worksheet (Group ${activeGroupTier})`}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aligned with State Primary FLN Syllabus • 10 Minutes Activity
              </p>
            </div>

            {/* Print / Export buttons */}
            {!isGenerating && worksheetContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="text-xs bg-[#0B3C5D] hover:bg-[#154c74] text-white font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Worksheet</span>
                </button>
              </div>
            )}
          </div>

          {/* Printable Worksheet Container */}
          <div
            id="worksheetPrintArea"
            className="mt-5 p-6 rounded-xl border border-slate-300 bg-white font-sans text-slate-800"
          >
            {/* Header for Paper */}
            <div className="border-b-2 border-slate-800 pb-3 mb-4 flex justify-between items-center text-xs">
              <div>
                <span className="font-black text-sm text-[#0B3C5D]">
                  શિક્ષાસાથી AI / ShikshaSaathi Classroom Worksheet
                </span>
                <div className="text-[11px] text-slate-500">
                  Subject: FLN Reading & Math • Time: 10 mins • Group {activeGroupTier}
                </div>
              </div>
              <div className="text-right">
                <div>Name: ____________________ Roll No: _____</div>
                <div>Date: _______________ Grade: 3 (Section B)</div>
              </div>
            </div>

            {/* Worksheet Body */}
            {isGenerating ? (
              <div className="py-12 text-center text-slate-500">
                <Sparkles className="w-8 h-8 text-[#3282B8] animate-spin mx-auto mb-2" />
                <p className="text-xs font-bold">Calling AI to synthesize customized classroom worksheet...</p>
                <p className="text-[11px] text-slate-400">
                  Tailoring phonics, vocabulary and math exercises for Group {activeGroupTier}
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                {worksheetContent}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
