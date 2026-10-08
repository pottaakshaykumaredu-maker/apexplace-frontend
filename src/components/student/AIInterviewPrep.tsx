import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { InterviewPrepResult, InterviewPrepQuestion } from '../../types';
import {
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

interface Props {
  initialJobTitle?: string;
  initialCompany?: string;
  onLaunchMockChat?: (jobTitle: string, company: string) => void;
}

export const AIInterviewPrep: React.FC<Props> = ({
  initialJobTitle = 'Software Development Engineer - Backend (Java / Spring)',
  initialCompany = 'TechCorp Systems',
  onLaunchMockChat,
}) => {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [companyName, setCompanyName] = useState(initialCompany);
  const [interviewType, setInterviewType] = useState('Technical Round');
  const [difficulty, setDifficulty] = useState('Medium-Hard');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<InterviewPrepResult | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const fetchPrep = async () => {
    setLoading(true);
    try {
      const data = await api.generateInterviewPrep(
        jobTitle,
        companyName,
        interviewType,
        difficulty
      );
      setPrepData(data);
    } catch (e) {
      console.error('Failed to generate interview prep', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrep();
  }, [jobTitle, companyName]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Filter Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Gemini AI Question Bank Generator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Targeted Interview Preparation Pack
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Deep, role-tailored technical & behavioral interview questions with model answers and follow-ups.
            </p>
          </div>

          {onLaunchMockChat && (
            <button
              onClick={() => onLaunchMockChat(jobTitle, companyName)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-purple-500/20 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Simulate Live Mock Interview</span>
            </button>
          )}
        </div>

        {/* Inputs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Role / Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. SDE Backend, ML Engineer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Target Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              placeholder="e.g. TechCorp, FinStream"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Round Type</label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500 focus:outline-hidden bg-white"
            >
              <option value="Technical Round">Technical Round (DSA / System / Code)</option>
              <option value="System Design Round">System Design & Architecture</option>
              <option value="HR & Cultural Fit">HR & Behavioral (STAR Method)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchPrep}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating...' : 'Refresh Questions'}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">
            Synthesizing industry questions with Gemini 3.8 Flash...
          </p>
        </div>
      ) : prepData ? (
        <div className="space-y-5">
          {/* Preparation Tips Banner */}
          {prepData.preparationTips && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/70 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Lightbulb className="w-4 h-4 text-purple-700" />
                <span>Interviewer Mindset & Strategy for {companyName}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {prepData.preparationTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-purple-950 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions Accordion */}
          <div className="space-y-4">
            {prepData.questions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        Q{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
                          Core Interview Problem
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100 text-xs">
                      {/* Suggested Answer */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Recommended Answer Architecture:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {q.suggestedAnswer}
                        </p>
                      </div>

                      {/* What Interviewers Probe For */}
                      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                        <span className="font-bold text-amber-900 block">
                          What the Evaluator is Looking For:
                        </span>
                        <p className="text-amber-950 font-medium leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>

                      {/* Follow-up Questions & Key Concepts */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {q.followUpQuestions && q.followUpQuestions.length > 0 && (
                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50">
                            <span className="font-bold text-slate-700 block">Anticipate Follow-ups:</span>
                            <div className="space-y-1 text-slate-600">
                              {q.followUpQuestions.map((f, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <span className="text-slate-400">•</span>
                                  <span>{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {q.importantTopics && q.importantTopics.length > 0 && (
                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50">
                            <span className="font-bold text-slate-700 block">Key Concepts:</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {q.importantTopics.map((top, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold">
                                  {top}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
