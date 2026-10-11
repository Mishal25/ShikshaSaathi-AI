import React from 'react';
import {
  Mic,
  FileSignature,
  Users,
  BookOpen,
  Calculator,
  AlertTriangle,
  Check,
  TrendingUp,
  RotateCcw,
  AlertCircle,
  ArrowRight,
  Ear,
  Rocket,
  Sparkles
} from 'lucide-react';
import { Language, SmartAlert } from '../types';
import { i18nDictionary } from '../data/mockData';
import { TabId } from './Sidebar';

interface DashboardTabProps {
  currentLanguage: Language;
  onNavigateTab: (tab: TabId) => void;
  alerts: SmartAlert[];
  onTriggerRemediation: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  currentLanguage,
  onNavigateTab,
  alerts,
  onTriggerRemediation
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;

  return (
    <section className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0B3C5D] via-[#154c74] to-[#3282B8] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="bg-[#FDB827] text-[#0B3C5D] font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block">
            FLN Diagnostic Overview
          </span>
          <h1 className="text-2xl font-bold mt-2">{dict.welcomeTeacher}</h1>
          <p className="text-sm text-sky-100 mt-1 leading-relaxed">{dict.welcomeSub}</p>

          <div className="flex flex-wrap gap-2.5 mt-4">
            <button
              onClick={() => onNavigateTab('assessment')}
              className="bg-white text-[#0B3C5D] hover:bg-amber-50 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-500" />
              <span>{dict.startVoiceAssess}</span>
            </button>
            <button
              onClick={() => onNavigateTab('grouping')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold px-3.5 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              <span>{dict.generateTodayWorksheets}</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Shapes & Brain Graphic */}
        <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-8 top-6 text-white/10 pointer-events-none select-none">
          <svg className="w-36 h-36" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-1.1 0-2.1.4-2.8 1.1-.7-.7-1.7-1.1-2.8-1.1-2.2 0-4 1.8-4 4 0 .5.1 1 .3 1.5C1.6 9.2 1 10.5 1 12c0 2 1.3 3.7 3.1 4.2.3 2.7 2.6 4.8 5.4 4.8.9 0 1.7-.2 2.5-.6.8.4 1.6.6 2.5.6 2.8 0 5.1-2.1 5.4-4.8 1.8-.5 3.1-2.2 3.1-4.2 0-1.5-.6-2.8-1.7-3.5.2-.5.3-1 .3-1.5 0-2.2-1.8-4-4-4-1.1 0-2.1.4-2.8 1.1-.7-.7-1.7-1.1-2.8-1.1zM9.5 5c1.4 0 2.5 1.1 2.5 2.5v9c-1.4 0-2.5-1.1-2.5-2.5V5zm5 0v9c0 1.4-1.1 2.5-2.5 2.5v-9c1.4 0 2.5-1.1 2.5-2.5z" />
          </svg>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{dict.cardTotalStudents}</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#0B3C5D]">35</span>
            <span className="text-[11px] text-slate-400 ml-1">enrolled</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> 100% screened this month
          </div>
        </div>

        {/* Foundational Reading Level */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{dict.cardReadingLevel}</span>
            <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-sm">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#3282B8]">65%</span>
            <span className="text-[11px] text-slate-400 ml-1">mastery</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +8% from baseline
          </div>
        </div>

        {/* Basic Math Mastery */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{dict.cardMathMastery}</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <Calculator className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#FDB827]">58%</span>
            <span className="text-[11px] text-slate-400 ml-1">mastery</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Subtraction needs push
          </div>
        </div>

        {/* Students Needing Support */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm bg-gradient-to-br from-white to-rose-50/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600">{dict.cardNeedSupport}</span>
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-600">6</span>
            <span className="text-[11px] text-slate-400 ml-1">students</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Remedial Group A
          </div>
        </div>
      </div>

      {/* Two Column Section: Distribution Chart & AI Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Class Distribution Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">{dict.chartTitle}</h3>
              <p className="text-xs text-slate-400">{dict.chartSub}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">
              Grade 3
            </span>
          </div>

          {/* Custom Horizontal Bar Visualizations with percentages */}
          <div className="space-y-4 pt-2">
            {/* Level 1 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-700">{dict.lvl1Title}</span>
                </div>
                <span className="font-bold text-rose-600">8 Students (23%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-700"
                  style={{ width: '23%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{dict.lvl1Desc}</p>
            </div>

            {/* Level 2 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="font-bold text-slate-700">{dict.lvl2Title}</span>
                </div>
                <span className="font-bold text-amber-600">18 Students (51%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: '51%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{dict.lvl2Desc}</p>
            </div>

            {/* Level 3 */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-700">{dict.lvl3Title}</span>
                </div>
                <span className="font-bold text-emerald-600">9 Students (26%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: '26%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{dict.lvl3Desc}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Classroom Median: <strong className="text-slate-800">Level 2.1</strong>
            </span>
            <button
              onClick={() => onNavigateTab('grouping')}
              className="text-[#3282B8] hover:text-[#0B3C5D] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Learning Groups</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Smart AI Teacher Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="font-bold text-slate-800 text-base">{dict.smartAlertsTitle}</h3>
              </div>
              <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                3 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{dict.alertsSubtitle}</p>

            <div className="space-y-3">
              {alerts.map((al) => {
                if (al.type === 'rose') {
                  return (
                    <div
                      key={al.id}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-200/70 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-rose-800">{dict.alert1Heading}</div>
                          <p className="text-rose-700 mt-0.5 text-[11px] leading-relaxed">
                            {dict.alert1Body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                if (al.type === 'amber') {
                  return (
                    <div
                      key={al.id}
                      className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <Ear className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-amber-800">{dict.alert2Heading}</div>
                          <p className="text-amber-700 mt-0.5 text-[11px] leading-relaxed">
                            {dict.alert2Body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={al.id}
                    className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <Rocket className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-emerald-800">{dict.alert3Heading}</div>
                        <p className="text-emerald-700 mt-0.5 text-[11px] leading-relaxed">
                          {dict.alert3Body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Refreshed 12m ago</span>
            <button
              onClick={onTriggerRemediation}
              className="text-xs bg-[#0B3C5D] hover:bg-[#154c74] text-white font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDB827]" />
              <span>Plan Remedial Session</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
