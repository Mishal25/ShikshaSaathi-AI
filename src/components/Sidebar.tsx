import React from 'react';
import { PieChart, Mic, Users, GraduationCap } from 'lucide-react';
import { Language } from '../types';
import { i18nDictionary } from '../data/mockData';

export type TabId = 'dashboard' | 'assessment' | 'grouping' | 'progress';

interface SidebarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
  currentLanguage: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  currentLanguage
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;

  const navItems = [
    {
      id: 'dashboard' as TabId,
      label: dict.tabDashboard,
      icon: <PieChart className="w-4 h-4" />
    },
    {
      id: 'assessment' as TabId,
      label: dict.tabAssessment,
      icon: <Mic className="w-4 h-4 text-sky-600" />
    },
    {
      id: 'grouping' as TabId,
      label: dict.tabGrouping,
      icon: <Users className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'progress' as TabId,
      label: dict.tabProgress,
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />
    }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-3 sticky top-24">
        {/* School / Grade Info Banner */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-blue-100/60 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0B3C5D] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              G3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Govt. Primary School</h4>
              <p className="text-[11px] text-slate-500">Grade 3 • Section B (35 Students)</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  isActive
                    ? 'text-white bg-[#0B3C5D] shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="w-4 flex justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <hr className="my-4 border-slate-100" />

        {/* Classroom Quick Info Widget */}
        <div className="px-2 py-1 text-xs text-slate-500 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-medium text-slate-400">Class Target:</span>
            <span className="font-bold text-slate-700">FLN NIPUN Mission</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '62%' }} />
          </div>
          <p className="text-[10px] text-slate-400">62% class mastery achieved this term.</p>
        </div>
      </div>
    </aside>
  );
};
