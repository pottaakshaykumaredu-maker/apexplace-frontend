import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SkillGapResult } from '../../types';
import {
  Sparkles,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Layers,
  Award,
} from 'lucide-react';

export const AISkillGapRoadmap: React.FC = () => {
  const { studentProfile } = useAuth();
  const [targetRole, setTargetRole] = useState('Senior Backend & Distributed Systems Engineer');
  const [loading, setLoading] = useState(false);
  const [gapData, setGapData] = useState<SkillGapResult | null>(null);

  const fetchGapAnalysis = async () => {
    setLoading(true);
    try {
      const skills = studentProfile?.skills || ['Java', 'Spring Boot', 'MySQL', 'React', 'Git'];
      const data = await api.getSkillGap(
        skills,
        targetRole,
        ['Apache Kafka', 'Kubernetes', 'Distributed Caching', 'High-Level System Design', 'Prometheus']
      );
      setGapData(data);
    } catch (e) {
      console.error('Gap analysis error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGapAnalysis();
  }, [targetRole]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Career Roadmap Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              AI Skill Gap Analysis & Learning Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Gemini calculates the delta between your profile and target enterprise roles, mapping out a custom learning trajectory.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="Senior Backend & Distributed Systems Engineer">
                Target: Backend & Distributed Systems
              </option>
              <option value="Full Stack Cloud Architect">Target: Full Stack Cloud Architect</option>
              <option value="Fintech Quantitative SDE">Target: Fintech Quantitative SDE</option>
              <option value="Machine Learning & AI Platform Engineer">
                Target: Machine Learning & AI Engineer
              </option>
            </select>
            <button
              onClick={fetchGapAnalysis}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              title="Refresh Roadmap"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">
            Synthesizing career learning curriculum with Gemini 3.8 Flash...
          </p>
        </div>
      ) : gapData ? (
        <div className="space-y-6">
          {/* Skill Comparison Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Acquired Skills */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Current Skills Verified ({gapData.matchedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gapData.matchedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 text-xs font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Gap Skills */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Identified Skill Gaps to Bridge ({gapData.missingSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gapData.missingSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Learning Topics */}
          {gapData.suggestedLearningTopics && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>Priority Learning Modules Recommended by Placement Advisors</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {gapData.suggestedLearningTopics.map((top, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-blue-950 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <span>{top}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Roadmap Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Step-by-Step Mastery Roadmap
                </h3>
                <p className="text-xs text-slate-500">
                  Structured progression from fundamentals to enterprise-grade interview mastery
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Estimated: 6-8 Weeks
              </span>
            </div>

            <div className="space-y-4">
              {gapData.roadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 sm:text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{step.duration}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
