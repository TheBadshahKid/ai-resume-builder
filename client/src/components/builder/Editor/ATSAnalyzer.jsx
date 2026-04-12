import React, { useState } from 'react';
import { useResume } from '../../../context/ResumeContext';
import { analyzeResumeATS } from '../../../services/api';
import { ScanSearch, AlertTriangle, CheckCircle, RefreshCcw, Briefcase, Target, TrendingUp, Info } from 'lucide-react';

const ScoreRing = ({ score, size = 80, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#059669' : score >= 45 ? '#D97706' : '#DC2626';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
        />
      </svg>
      <span className="absolute text-lg font-black" style={{ color }}>{score}</span>
    </div>
  );
};

const ATSAnalyzer = () => {
  const { resumeData, jobDescription, setJobDescription, atsData, setAtsData } = useResume();
  const [loading, setLoading] = useState(false);

  const extractResumeText = () => {
    const parts = [
      resumeData.personal.summary,
      resumeData.personal.jobTitle,
      ...resumeData.experience.map(e => `${e.jobTitle} ${e.company} ${e.description}`),
      ...resumeData.education.map(e => `${e.degree} ${e.school}`),
      ...resumeData.projects.map(p => `${p.title} ${p.description}`),
      resumeData.skills.join(' ')
    ];
    return parts.filter(Boolean).join('\n\n');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const resumeText = extractResumeText();
    
    if (resumeText.length < 50) {
      alert("Please add more content to your resume before analyzing.");
      setLoading(false);
      return;
    }

    const data = await analyzeResumeATS(resumeText, jobDescription);
    setAtsData(data);
    setLoading(false);
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-emerald-600' };
    if (score >= 60) return { text: 'Good', color: 'text-amber-600' };
    if (score >= 40) return { text: 'Fair', color: 'text-orange-600' };
    return { text: 'Needs Work', color: 'text-red-600' };
  };

  const getMatchLabel = (pct) => {
    if (pct === null || pct === undefined) return null;
    if (pct >= 60) return { text: 'Strong Match', bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200' };
    if (pct >= 35) return { text: 'Moderate Match', bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200' };
    return { text: 'Low Match', bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200' };
  };

  const matchLabel = atsData ? getMatchLabel(atsData.job_match_percentage) : null;
  const scoreLabel = atsData ? getScoreLabel(atsData.score) : null;
  const hasJobMatch = atsData && atsData.job_match_percentage !== null && atsData.job_match_percentage !== undefined;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ScanSearch className="text-brand-rust" /> 
            ATS Score Checker
          </h2>
          <p className="text-sm text-gray-500 mt-1">Compare your resume against industry rules &amp; Job Description.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        
        {/* Job Description Input */}
        <div className="bg-white border text-sm border-gray-200 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
             <Briefcase size={16} className="text-blue-500" />
             Target Job Description <span className="text-gray-400 font-normal text-xs ml-1">(optional but recommended)</span>
          </label>
          <textarea
            rows="5"
            placeholder="Paste the job description here to get a customized Match % and Keyword analysis..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-rust resize-none outline-none text-gray-700"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
          
          <button 
             onClick={handleAnalyze}
             disabled={loading}
             className="mt-3 w-full bg-brand-zinc text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-75"
          >
             {loading ? <RefreshCcw className="animate-spin" size={18} /> : <ScanSearch size={18} />}
             {loading ? 'Analyzing...' : 'Run ATS Scan'}
          </button>
        </div>

        {/* Results Area */}
        {atsData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            
            {/* Fallback Indicator */}
            {atsData.isFallback && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 text-blue-700 text-xs font-medium">
                <div className="bg-blue-100 p-1.5 rounded-full"><Info size={14} /></div>
                <span>Lightweight offline analysis active. Connect the backend for full AI-powered scoring.</span>
              </div>
            )}
            
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Overall ATS Score */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">ATS Score</p>
                <ScoreRing score={atsData.score ?? 0} />
                <span className={`text-xs font-bold mt-1 ${scoreLabel?.color}`}>{scoreLabel?.text}</span>
              </div>
              
              {/* Job Match % */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Target size={12} /> Job Match
                </p>
                {hasJobMatch ? (
                  <>
                    <ScoreRing score={atsData.job_match_percentage} />
                    {matchLabel && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${matchLabel.bg} ${matchLabel.color} ${matchLabel.border}`}>
                        {matchLabel.text}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Briefcase size={28} className="text-gray-300" />
                    <p className="text-xs text-gray-400 text-center leading-tight">Add a job description<br/>to calculate match</p>
                  </div>
                )}
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
               <div>
                  <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>Missing Keywords
                  </h4>
                  {atsData.missing_keywords && atsData.missing_keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                       {atsData.missing_keywords.slice(0, 20).map(kw => (
                         <span key={kw} className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                            {kw}
                         </span>
                       ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 font-medium">
                      {jobDescription ? '✓ No major keywords missing!' : 'Add a job description to see missing keywords.'}
                    </p>
                  )}
               </div>

               <div>
                  <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {atsData.matched_keywords?.slice(0, 20).map(kw => (
                       <span key={kw} className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {kw}
                       </span>
                     ))}
                     {(!atsData.matched_keywords || atsData.matched_keywords.length === 0) && (
                       <span className="text-sm text-gray-400">
                         {jobDescription ? 'No keyword matches found. Try adding relevant skills.' : 'Provide a JD to see matched keywords.'}
                       </span>
                     )}
                  </div>
               </div>
            </div>

            {/* AI Suggestions */}
            {atsData.suggestions && atsData.suggestions.length > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm">
                 <h4 className="font-semibold text-brand-rust flex items-center gap-2 mb-3 text-sm">
                   <AlertTriangle size={16} /> Improvement Suggestions
                 </h4>
                 <ul className="space-y-2.5">
                   {atsData.suggestions.map((sug, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <TrendingUp size={14} className="text-brand-rust mt-0.5 flex-shrink-0" />
                        <span>{sug}</span>
                      </li>
                   ))}
                 </ul>
              </div>
            )}

          </div>
        )}
        
        {!atsData && !loading && (
           <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <ScanSearch className="text-gray-300 mb-3" size={48} />
              <p className="text-gray-500 font-medium mb-1">Ready to Analyze</p>
              <p className="text-gray-400 text-sm">Add your resume content &amp; paste a job description, then run the scan.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default ATSAnalyzer;
