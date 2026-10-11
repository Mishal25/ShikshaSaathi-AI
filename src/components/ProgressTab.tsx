import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Language, Student } from '../types';
import { i18nDictionary } from '../data/mockData';

interface ProgressTabProps {
  currentLanguage: Language;
  students: Student[];
  onOpenStudentDetail: (student: Student) => void;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  currentLanguage,
  students,
  onOpenStudentDetail
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');

  const filteredStudents = students.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === 'ALL' || s.group === groupFilter;
    return matchesName && matchesGroup;
  });

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">{dict.progressModuleTitle}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{dict.progressModuleSub}</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student name..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3282B8] w-48"
            />
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as 'ALL' | 'A' | 'B' | 'C')}
            className="text-xs border border-slate-200 bg-slate-50 py-1.5 px-3 rounded-xl focus:outline-none font-semibold text-slate-700 cursor-pointer"
          >
            <option value="ALL">All Groups ({students.length})</option>
            <option value="A">
              Group A - Foundational ({students.filter((s) => s.group === 'A').length})
            </option>
            <option value="B">
              Group B - Intermediate ({students.filter((s) => s.group === 'B').length})
            </option>
            <option value="C">
              Group C - Advanced ({students.filter((s) => s.group === 'C').length})
            </option>
          </select>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll</th>
                <th className="py-3 px-4">Current Group</th>
                <th className="py-3 px-4">Reading Fluency</th>
                <th className="py-3 px-4">Math Score</th>
                <th className="py-3 px-4">FLN Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((s) => {
                let groupBadge = (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Group B
                  </span>
                );
                if (s.group === 'A') {
                  groupBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      Group A
                    </span>
                  );
                } else if (s.group === 'C') {
                  groupBadge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Group C
                    </span>
                  );
                }

                let statusBadge = (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Mastered
                  </span>
                );
                if (s.flnStatus === 'Remedial Need') {
                  statusBadge = (
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Needs Support
                    </span>
                  );
                } else if (s.flnStatus === 'Progressing') {
                  statusBadge = (
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> On Track
                    </span>
                  );
                }

                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0B3C5D]/10 text-[#0B3C5D] flex items-center justify-center font-black text-[10px]">
                        {s.name.charAt(0)}
                      </div>
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">#{s.roll}</td>
                    <td className="py-3 px-4">{groupBadge}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{s.readingWpm} WPM</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{s.mathScore}%</td>
                    <td className="py-3 px-4">{statusBadge}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenStudentDetail(s)}
                        className="text-xs text-[#3282B8] hover:text-[#0B3C5D] font-bold hover:underline px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 cursor-pointer"
                      >
                        View Log
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredStudents.length} of {students.length} Students
          </span>
          <span className="text-[11px] text-slate-400">Class 3B • Term 2 (2024-25)</span>
        </div>
      </div>
    </section>
  );
};
