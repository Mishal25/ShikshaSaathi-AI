/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, Student, SmartAlert } from './types';
import { initialStudentsData, initialSmartAlerts } from './data/mockData';
import { getStoredConfig } from './services/aiService';
import { Header } from './components/Header';
import { Sidebar, TabId } from './components/Sidebar';
import { DashboardTab } from './components/DashboardTab';
import { AssessmentTab } from './components/AssessmentTab';
import { GroupingTab } from './components/GroupingTab';
import { ProgressTab } from './components/ProgressTab';
import { ApiKeyModal } from './components/ApiKeyModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [selectedStudentKey, setSelectedStudentKey] = useState<string>('aarav');
  const [alerts] = useState<SmartAlert[]>(initialSmartAlerts);

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [activeDetailStudent, setActiveDetailStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const cfg = getStoredConfig();
    setIsApiConfigured(Boolean(cfg.apiKey && cfg.apiKey.trim().length > 5));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    document.body.classList.remove('lang-hi', 'lang-gu');
    if (lang === 'hi') document.body.classList.add('lang-hi');
    if (lang === 'gu') document.body.classList.add('lang-gu');

    const label =
      lang === 'hi' ? 'हिंदी (Hindi)' : lang === 'gu' ? 'ગુજરાતી (Gujarati)' : 'English';
    showToast(`Language switched to ${label}`);
  };

  const handlePromoteStudent = (studentId: number) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            level: 2,
            group: 'B',
            flnStatus: 'Progressing',
            readingWpm: Math.max(st.readingWpm, 26)
          };
        }
        return st;
      })
    );
  };

  const handleSaveStudentNotes = (studentId: number, notes: string) => {
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, notes } : st))
    );
    showToast('Student intervention notes saved successfully!');
  };

  const handleTriggerRemediation = () => {
    setCurrentTab('grouping');
    showToast('Opened Remedial Session planning.');
  };

  const handleLaunchAssessmentFromModal = (studentKey: string) => {
    setSelectedStudentKey(studentKey);
    setCurrentTab('assessment');
  };

  return (
    <div className="text-slate-800 antialiased min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Sticky Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isApiConfigured={isApiConfigured}
      />

      {/* Main Body Layout: Sidebar + Tab Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          currentLanguage={currentLanguage}
        />

        {/* Content Workspace */}
        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardTab
              currentLanguage={currentLanguage}
              onNavigateTab={setCurrentTab}
              alerts={alerts}
              onTriggerRemediation={handleTriggerRemediation}
            />
          )}

          {currentTab === 'assessment' && (
            <AssessmentTab
              currentLanguage={currentLanguage}
              selectedStudentKey={selectedStudentKey}
              onStudentKeyChange={setSelectedStudentKey}
              onShowToast={showToast}
              onPromoteStudent={handlePromoteStudent}
            />
          )}

          {currentTab === 'grouping' && (
            <GroupingTab
              currentLanguage={currentLanguage}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressTab
              currentLanguage={currentLanguage}
              students={students}
              onOpenStudentDetail={(st) => setActiveDetailStudent(st)}
            />
          )}
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSave={(configured) => {
          setIsApiConfigured(configured);
          showToast(
            configured
              ? 'API Key saved! Live AI calls enabled.'
              : 'Switched to Demo Mode (Mock LLM).'
          );
        }}
      />

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={activeDetailStudent}
        isOpen={Boolean(activeDetailStudent)}
        onClose={() => setActiveDetailStudent(null)}
        onSaveNotes={handleSaveStudentNotes}
        onLaunchAssessment={handleLaunchAssessmentFromModal}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
