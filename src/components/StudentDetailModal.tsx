import React, { useState, useEffect } from 'react';
import { X, Mic } from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (studentId: number, notes: string) => void;
  onLaunchAssessment: (studentKey: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onSaveNotes,
  onLaunchAssessment
}) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (student) {
      setNotes(student.notes || '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const groupLabel =
    student.group === 'A'
      ? 'Foundational Support'
      : student.group === 'B'
      ? 'Core Practice'
      : 'Advanced Mastery';

  const handleSave = () => {
    onSaveNotes(student.id, notes);
  };

  const handleLaunch = () => {
    let key = 'aarav';
    const lower = student.name.toLowerCase();
    if (lower.includes('rahul')) key = 'rahul';
    else if (lower.includes('priya')) key = 'priya';
    else if (lower.includes('meera')) key = 'meera';
    else if (lower.includes('kabir')) key = 'kabir';

    onClose();
    onLaunchAssessment(key);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#0B3C5D] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FDB827] text-[#0B3C5D] flex items-center justify-center font-bold text-base">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-sm">{student.name} - Grade 3</h3>
              <p className="text-[11px] text-sky-200">
                Roll No: {student.roll} • Group {student.group} ({groupLabel})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Score Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 font-bold block">READING WPM</span>
              <span className="text-xl font-black text-[#3282B8]">{student.readingWpm} WPM</span>
              <span className="text-[10px] text-rose-500 font-semibold block">Target: 30+</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 font-bold block">MATH ACCURACY</span>
              <span className="text-xl font-black text-[#FDB827]">{student.mathScore}%</span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                Level {student.level} Arithmetic
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 font-bold block">ASSESSMENTS</span>
              <span className="text-xl font-black text-emerald-600">4 Done</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">+12% Growth</span>
            </div>
          </div>

          {/* Historical Assessment Logs */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Historical Assessment Timeline
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">
                    Diagnostic Voice Assessment (FLN Formative)
                  </span>
                  <div className="text-[11px] text-slate-500">
                    Recorded {student.readingWpm} WPM | Phonics accuracy 88%
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">2 days ago</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800">Mental Math Baseline Check</span>
                  <div className="text-[11px] text-slate-500">
                    Addition &amp; Subtraction Word Problems Score: {student.mathScore}%
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">1 week ago</span>
              </div>
            </div>
          </div>

          {/* Teacher Intervention Notes */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Teacher Intervention Notes
              </h4>
              <span className="text-[10px] text-slate-400">FLN Pedagogical Record</span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3282B8]"
              placeholder="Write teacher notes, specific phonics observations, home practice recommendations..."
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSave}
                className="text-xs bg-[#0B3C5D] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-700 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={handleLaunch}
            className="text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" /> Start Voice Test for {student.name.split(' ')[0]}
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:bg-slate-200 font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
