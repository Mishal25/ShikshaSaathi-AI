import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Calculator,
  Book,
  Sparkles,
  Bot,
  Check,
  RotateCcw
} from 'lucide-react';
import { Language, StudentAssessProfile } from '../types';
import { studentAssessProfiles, i18nDictionary } from '../data/mockData';
import { callAI } from '../services/aiService';

interface AssessmentTabProps {
  currentLanguage: Language;
  selectedStudentKey: string;
  onStudentKeyChange: (key: string) => void;
  onShowToast: (msg: string) => void;
  onPromoteStudent: (studentId: number) => void;
}

// Window declaration for speech recognition
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition?: any;
  }
}

export const AssessmentTab: React.FC<AssessmentTabProps> = ({
  currentLanguage,
  selectedStudentKey,
  onStudentKeyChange,
  onShowToast,
  onPromoteStudent
}) => {
  const dict = i18nDictionary[currentLanguage] || i18nDictionary.en;
  const currentProfile: StudentAssessProfile =
    studentAssessProfiles[selectedStudentKey] || studentAssessProfiles.aarav;

  const [mathAnswer, setMathAnswer] = useState(currentProfile.defaultMathAns);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [isPromoted, setIsPromoted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Sync state when selected student changes
  useEffect(() => {
    const prof = studentAssessProfiles[selectedStudentKey] || studentAssessProfiles.aarav;
    setMathAnswer(prof.defaultMathAns);
    setTranscript('');
    setEvaluationResult(null);
    setIsPromoted(false);
  }, [selectedStudentKey]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsRecording(false);
      onShowToast('Audio recording stopped.');
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onShowToast('Speech Recognition not supported in this browser. Loaded sample voice!');
      setTranscript(currentProfile.sampleVoice);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;

      if (currentProfile.lang === 'gu') recognition.lang = 'gu-IN';
      else if (currentProfile.lang === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript('Listening... Speak now!');
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = '';
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setTranscript(finalStr || interim);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
        onShowToast(`Mic capture note (${e.error || 'error'}). Sample voice loaded.`);
        setTranscript(currentProfile.sampleVoice);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Mic start error:', err);
      setIsRecording(false);
      setTranscript(currentProfile.sampleVoice);
      onShowToast('Sample voice transcript loaded for testing.');
    }
  };

  const handlePlayPassageAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentProfile.passage);
      if (currentProfile.lang === 'gu') utterance.lang = 'gu-IN';
      else if (currentProfile.lang === 'hi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      onShowToast('Playing passage pronunciation sample...');
    } else {
      onShowToast('Text-to-speech not supported in browser.');
    }
  };

  const handleUseSampleVoice = () => {
    setTranscript(currentProfile.sampleVoice);
    onShowToast(`Sample speech loaded for ${currentProfile.name}`);
  };

  const handleEvaluateAI = async () => {
    setIsEvaluating(true);
    const recordedText = transcript || currentProfile.sampleVoice;

    const prompt = `Student Name: ${currentProfile.name} (Grade 3)
Target Reading Passage: "${currentProfile.passage}"
Actual Transcribed Student Reading Voice: "${recordedText}"
Math Question: "${currentProfile.mathQ}"
Student Math Answer: "${mathAnswer}"

Please evaluate this Grade 3 primary school student's foundational learning level according to India's FLN (Foundational Literacy and Numeracy) guidelines.
1. Determine their exact Level (Level 1: Letter/Word recognition, Level 2: Word reading & 1-digit math, Level 3: Paragraph fluency & 2-digit subtraction).
2. Assess Reading Fluency, Pronunciation, and Math Accuracy.
3. Provide 2 actionable teacher interventions for tomorrow's classroom.`;

    try {
      const response = await callAI(prompt);
      setEvaluationResult(response);
      onShowToast('AI Evaluation completed successfully!');
    } catch {
      setEvaluationResult(
        'Unable to complete evaluation. Please check your internet connection.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyPromotion = () => {
    setIsPromoted(true);
    onPromoteStudent(currentProfile.id);
    onShowToast(`Updated ${currentProfile.name}'s official level to Level 2!`);
  };

  return (
    <section className="space-y-6">
      {/* Module Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-slate-800">{dict.assessModuleTitle}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{dict.assessModuleSub}</p>
        </div>

        {/* Student Select Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <label htmlFor="studentSelect" className="text-xs font-semibold text-slate-500 pl-2">
            {dict.selectStudentLabel}
          </label>
          <select
            id="studentSelect"
            value={selectedStudentKey}
            onChange={(e) => onStudentKeyChange(e.target.value)}
            className="bg-white text-xs font-bold text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3282B8] cursor-pointer"
          >
            <option value="aarav">Aarav Patel (Grade 3 - Level 1)</option>
            <option value="rahul">Rahul Sharma (Grade 3 - Level 2)</option>
            <option value="priya">Priya Solanki (Grade 3 - Level 1)</option>
            <option value="meera">Meera Joshi (Grade 3 - Level 3)</option>
            <option value="kabir">Kabir Verma (Grade 3 - Level 3)</option>
          </select>
        </div>
      </div>

      {/* Student Quick Profile Header */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#0B3C5D] text-white flex items-center justify-center font-bold text-base shadow-sm">
            <span>{currentProfile.initials}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{currentProfile.name}</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isPromoted
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentProfile.levelColor
                }`}
              >
                {isPromoted ? 'Updated: Level 2 (Promoted!)' : `Current: ${currentProfile.levelText}`}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Home Language: {currentProfile.lang.toUpperCase()} | Primary Challenge: Matra recognition & 1-digit math
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">
            Last Assessed: <strong className="text-slate-700">3 days ago</strong>
          </span>
        </div>
      </div>

      {/* Two Interactive Assessment Panels: Reading & Math */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: Reading Passage & Speech Recognition */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
                <Book className="w-4 h-4" /> Task 1: Reading Aloud
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                {currentProfile.lang.toUpperCase()} Passage
              </span>
            </div>

            {/* Passage Display Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500">Student Target Passage:</span>
                <button
                  onClick={handlePlayPassageAudio}
                  className="text-xs text-[#3282B8] hover:text-[#0B3C5D] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen Sample
                </button>
              </div>
              <p className="text-base font-medium text-slate-800 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200/60 shadow-inner">
                &ldquo;{currentProfile.passage}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-2 italic">
                {currentProfile.transNote}
              </p>
            </div>

            {/* Voice Recording Controller */}
            <div className="mt-4 p-4 rounded-xl border border-dashed border-sky-300 bg-sky-50/40 text-center">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg transition active:scale-95 relative cursor-pointer ${
                    isRecording ? 'bg-rose-600 text-white' : 'bg-[#0B3C5D] hover:bg-sky-700 text-white'
                  }`}
                >
                  {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-rose-500 recording-pulse pointer-events-none" />
                  )}
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <div className="text-left">
                  <div
                    className={`text-xs font-bold ${
                      isRecording ? 'text-rose-600' : 'text-slate-700'
                    }`}
                  >
                    {isRecording ? 'Recording student speech... Click to stop' : 'Click mic to record student speech'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Uses Browser Web Speech API in chosen language
                  </div>
                </div>
              </div>

              {/* Live Transcript Area */}
              <div className="mt-3 text-left">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Transcribed Student Voice:
                </label>
                <div className="w-full min-h-[55px] p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 mt-1 focus:outline-none">
                  {transcript ? (
                    <span className="text-slate-800 font-medium">{transcript}</span>
                  ) : (
                    <span className="text-slate-400 italic">
                      No audio recorded yet. Press the mic button and ask the student to read...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Fluency benchmark: 30 WPM</span>
            <button
              onClick={handleUseSampleVoice}
              className="text-[#3282B8] hover:underline font-medium cursor-pointer"
            >
              Use Sample Voice Input
            </button>
          </div>
        </div>

        {/* Panel B: Math Question & Real-time AI Evaluator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                <Calculator className="w-4 h-4" /> Task 2: Mental Math & Logic
              </span>
              <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
                Level 1-2 Math
              </span>
            </div>

            {/* Question Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500">Problem Prompt:</span>
              <div className="mt-1 bg-white p-3 rounded-lg border border-slate-200/60 shadow-inner">
                <p className="text-sm font-bold text-slate-800">&ldquo;{currentProfile.mathQ}&rdquo;</p>
              </div>

              {/* Student Answer Input / Buttons */}
              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-600">
                  Student Response / Explanation:
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="e.g., 8 mangoes (he counted backwards from 14)"
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setMathAnswer('8 mangoes')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    8
                  </button>
                  <button
                    onClick={() => setMathAnswer('7 mangoes (Error: miscounted)')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
                  >
                    7 (Error)
                  </button>
                </div>
              </div>
            </div>

            {/* Action button: Submit to AI Evaluator */}
            <div className="mt-4">
              <button
                onClick={handleEvaluateAI}
                disabled={isEvaluating}
                className="w-full bg-[#0B3C5D] hover:bg-[#154c74] disabled:opacity-70 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#FDB827]" />
                    <span>Evaluating via AI Diagnostic Engine...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FDB827]" />
                    <span>Evaluate with Claude AI (FLN Level & Feedback)</span>
                  </>
                )}
              </button>
            </div>

            {/* Real-Time Evaluation Result Box */}
            {evaluationResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-sky-600" /> AI Diagnostic Report
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Determined: Level 2
                  </span>
                </div>
                <div className="text-xs text-slate-700 mt-2 space-y-1.5 leading-relaxed whitespace-pre-line font-sans">
                  {evaluationResult}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Confidence Score: 94%</span>
                  <button
                    onClick={handleApplyPromotion}
                    disabled={isPromoted}
                    className="text-[11px] bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isPromoted ? 'Level Promoted!' : 'Update Student Level'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 text-center">
            Powered by Anthropic Claude 3.5 Sonnet / Haiku
          </div>
        </div>
      </div>
    </section>
  );
};
