import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ResumeAnalysisResult } from '../../types';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Award,
  Layers,
  XCircle,
} from 'lucide-react';

export const ResumeAIAnalyzer: React.FC = () => {
  const { studentProfile, refreshProfile } = useAuth();

  const [analyzing, setAnalyzing] = useState(false);

  const [analysis, setAnalysis] =
    useState<ResumeAnalysisResult | null>(
      studentProfile?.resumeAnalysis || null
    );

  const [resumeTextInput, setResumeTextInput] =
    useState(studentProfile?.resumeText || '');

  const [activeMode, setActiveMode] =
    useState<'view' | 'edit-text'>('view');

  const [uploading, setUploading] = useState(false);

  const [uploadStatus, setUploadStatus] =
    useState<'idle' | 'success' | 'error'>('idle');

  const [uploadMessage, setUploadMessage] = useState('');

  const [uploadedResume, setUploadedResume] = useState<{
    fileName: string;
    uploadedAt: string;
    resumeUrl?: string;
  } | null>(
    studentProfile?.resumeFileName
      ? {
          fileName: studentProfile.resumeFileName,
          uploadedAt:
            studentProfile.resumeUploadedAt || '',
          resumeUrl: studentProfile.resumeUrl,
        }
      : null
  );

  const handleRunAnalysis = async (customText?: string) => {
    setAnalyzing(true);

    try {
      const res = await api.analyzeResume(
        customText || resumeTextInput
      );

      setAnalysis(res);

      await api.updateStudentProfile({
        resumeAnalysis: res,
        resumeText: customText || resumeTextInput,
      });

      await refreshProfile();
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setUploadMessage('');

    try {
      if (
        file.type !== 'application/pdf' &&
        !file.name.toLowerCase().endsWith('.pdf')
      ) {
        throw new Error('Only PDF resumes are allowed.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          'Resume must be smaller than 10 MB.'
        );
      }

      const uploadRes = await api.uploadResume(
        file,
        studentProfile?.user?.id
          ? String(studentProfile.user.id)
          : undefined
      );

      setUploadedResume({
        fileName: uploadRes.fileName,
        uploadedAt: uploadRes.uploadedAt,
        resumeUrl: uploadRes.resumeUrl,
      });

      setUploadStatus('success');
      setUploadMessage(
        'Resume uploaded successfully.'
      );

      await refreshProfile();

      const text = await file.text().catch(() => '');

      if (text && text.length > 50) {
        setResumeTextInput(text);
        await handleRunAnalysis(text);
      } else {
        await handleRunAnalysis();
      }
    } catch (err) {
      console.error('File upload failed:', err);

      setUploadStatus('error');

      setUploadMessage(
        err instanceof Error
          ? err.message
          : 'Resume upload failed. Please try again.'
      );
    } finally {
      setUploading(false);

      e.target.value = '';
    }
  };

  const score = analysis?.overallScore || 88;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">

        <div className="space-y-1">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Resume Intelligence</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            ATS Resume Scanner & Keyword Optimization
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Gemini parses your projects, technical skills,
            and metrics to measure ATS pass rate.
          </p>

        </div>

        <div className="flex items-center gap-3">

          {/* UPLOAD BUTTON */}
          <label
            className={`cursor-pointer px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
              uploading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >

            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />

                <span>
                  {uploadedResume
                    ? 'Upload New Resume'
                    : 'Upload Resume'}
                </span>
              </>
            )}

            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />

          </label>

          {/* ANALYZE BUTTON */}
          <button
            onClick={() => handleRunAnalysis()}
            disabled={analyzing || uploading}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-all"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                analyzing ? 'animate-spin' : ''
              }`}
            />

            <span>
              {analyzing
                ? 'Analyzing with Gemini...'
                : 'Re-Analyze'}
            </span>
          </button>

        </div>
      </div>

      {/* UPLOADING */}
      {uploading && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold flex items-center gap-3">

          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />

          <div>
            <p className="font-bold">
              Uploading your resume...
            </p>

            <p className="text-xs text-blue-600 mt-1">
              Please wait while your resume is saved.
            </p>
          </div>

        </div>
      )}

      {/* SUCCESS */}
      {uploadStatus === 'success' && uploadedResume && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />

            <div className="flex-1">

              <p className="text-sm font-bold">
                Resume uploaded successfully
              </p>

              <p className="text-xs mt-1 text-emerald-700">
                Current Resume:{' '}
                <span className="font-bold">
                  {uploadedResume.fileName}
                </span>
              </p>

              {uploadedResume.uploadedAt && (
                <p className="text-xs mt-1 text-emerald-600">
                  Uploaded:{' '}
                  {new Date(
                    uploadedResume.uploadedAt
                  ).toLocaleString()}
                </p>
              )}

              {uploadedResume.resumeUrl && (
                <a
                  href={uploadedResume.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
                >
                  <FileText className="w-4 h-4" />
                  View Current Resume
                </a>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ERROR */}
      {uploadStatus === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">

          <div className="flex items-start gap-3">

            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />

            <div>

              <p className="text-sm font-bold">
                Resume upload failed
              </p>

              <p className="text-xs mt-1 text-red-700">
                {uploadMessage}
              </p>

            </div>

          </div>

        </div>
      )}

      {/* CURRENT RESUME */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <div>

            <p className="text-sm font-bold text-slate-900">
              Current Resume
            </p>

            {uploadedResume ? (
              <>
                <p className="text-sm text-slate-700 font-semibold mt-1">
                  {uploadedResume.fileName}
                </p>

                {uploadedResume.uploadedAt && (
                  <p className="text-xs text-slate-500 mt-1">
                    Uploaded{' '}
                    {new Date(
                      uploadedResume.uploadedAt
                    ).toLocaleString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                No resume uploaded yet.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">

          <div>

            <div className="flex items-center justify-between">

              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ATS Compatibility Score
              </span>

              <Award className="w-5 h-5 text-amber-400" />

            </div>

            <div className="mt-4 flex items-baseline gap-3">

              <span className="text-5xl font-black tracking-tight text-white">
                {score}
              </span>

              <span className="text-xl text-slate-400 font-semibold">
                / 100
              </span>

            </div>

            <p className="mt-2 text-xs text-slate-300 font-medium leading-relaxed">

              {score >= 85
                ? 'Excellent score! Your resume aligns well with top tier campus tech requirements.'
                : score >= 70
                  ? 'Good score. Adding quantifiable system metrics will elevate you to the top 5%.'
                  : 'Needs optimization. Important technical keywords and project descriptions are missing.'}

            </p>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">

            <span>
              Target Role: Backend / Fullstack
            </span>

            <span className="text-emerald-400 font-bold">
              Top 12% Candidate
            </span>

          </div>

        </div>

        {/* PROFILE */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">

          <div className="space-y-2">

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">

                <Sparkles className="w-4 h-4 text-blue-600" />

                <span>
                  AI Profile Overview
                </span>

              </h3>

              <span className="text-xs text-slate-400">

                Active Resume:{' '}

                {studentProfile?.resumeFileName ||
                  uploadedResume?.fileName ||
                  'No resume uploaded'}

              </span>

            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">

              {analysis?.summary ||
                'Upload a resume to generate an AI profile overview.'}

            </p>

          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">

              <div className="text-base font-black text-slate-800">
                {analysis?.skills?.length || 0}
              </div>

              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Skills Extracted
              </div>

            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">

              <div className="text-base font-black text-emerald-600">
                {analysis?.strengths?.length || 0}
              </div>

              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Key Strengths
              </div>

            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">

              <div className="text-base font-black text-amber-600">
                {analysis?.missingSkills?.length || 0}
              </div>

              <div className="text-[10px] text-slate-500 font-bold uppercase">
                Missing Keywords
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SKILLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

        <div className="flex items-center justify-between">

          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">

            <Layers className="w-4 h-4 text-blue-600" />

            <span>
              Extracted Skills & Competencies
            </span>

          </h3>

          <span className="text-xs text-slate-500 font-medium">
            Recognized by Tech Recruitment ATS
          </span>

        </div>

        <div className="flex flex-wrap gap-2">

          {(analysis?.skills ||
            studentProfile?.skills ||
            []).map((skill, i) => (

            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200/60 text-xs font-semibold shadow-2xs"
            >
              {skill}
            </span>

          ))}

        </div>

      </div>

      {/* STRENGTHS / MISSING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

          <div className="flex items-center gap-2">

            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">

              <CheckCircle2 className="w-4 h-4" />

            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Demonstrated Strengths
            </h3>

          </div>

          <div className="space-y-2.5">

            {(analysis?.strengths || []).map(
              (strength, i) => (

                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs text-slate-700"
                >

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />

                  <span className="leading-relaxed font-medium">
                    {strength}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

          <div className="flex items-center gap-2">

            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">

              <AlertTriangle className="w-4 h-4" />

            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Missing ATS Keywords for SDE Roles
            </h3>

          </div>

          <div className="space-y-2.5">

            {(analysis?.missingSkills || []).map(
              (skill, i) => (

                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/40 border border-amber-100 text-xs text-slate-700"
                >

                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />

                  <span className="leading-relaxed font-medium">
                    {skill}
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </div>

      {/* SUGGESTIONS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

        <div className="flex items-center gap-2">

          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">

            <Lightbulb className="w-4 h-4" />

          </div>

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              High-Impact Optimization Suggestions
            </h3>

            <p className="text-xs text-slate-500">
              Implement these to increase recruiter interview calls
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {(analysis?.suggestions || []).map(
            (suggestion, i) => (

              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2"
              >

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Tip #{i + 1}
                </span>

                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {suggestion}
                </p>

              </div>

            )
          )}

        </div>

      </div>

      {/* RESUME TEXT */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-sm font-bold text-slate-900">
              Resume Plain Text Preview
            </h3>

            <p className="text-xs text-slate-500">
              View or modify the text parsed by the ATS crawler
            </p>

          </div>

          <button
            onClick={() =>
              setActiveMode(
                activeMode === 'view'
                  ? 'edit-text'
                  : 'view'
              )
            }
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {activeMode === 'view'
              ? 'Edit Raw Text'
              : 'Done Editing'}
          </button>

        </div>

        {activeMode === 'view' ? (

          <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-mono text-slate-700 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {resumeTextInput ||
              'No resume text loaded yet.'}
          </pre>

        ) : (

          <div className="space-y-3">

            <textarea
              rows={8}
              value={resumeTextInput}
              onChange={(e) =>
                setResumeTextInput(e.target.value)
              }
              className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="Paste or edit resume text here..."
            />

            <button
              onClick={() => handleRunAnalysis()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Save & Re-Score with Gemini
            </button>

          </div>

        )}

      </div>

    </div>
  );
};