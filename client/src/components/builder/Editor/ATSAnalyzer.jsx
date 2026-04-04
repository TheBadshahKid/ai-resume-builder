import React, { useState } from 'react';
import { useResume } from '../../../context/ResumeContext';
import { analyzeResumeATS } from '../../../services/api';
import { ScanSearch, AlertTriangle, CheckCircle, RefreshCcw, Briefcase } from 'lucide-react';

const ATSAnalyzer = () => {
  const { resumeData, jobDescription, setJobDescription, atsData, setAtsData } = useResume();
  const [loading, setLoading] = useState(false);

  const extractResumeText = () => {
    // Naively extract all text directly from state to send to parser
    const parts = [
      resumeData.personal.summary,
      ...resumeData.experience.map(e => `${e.jobTitle} ${e.company} ${e.description}`),
      ...resumeData.education.map(e => `${e.degree} ${e.school}`),
      resumeData.skills.join(' ')
    ];
    return parts.join('\n\n');
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
    setAtsData(data); // data is now guaranteed to be an object (local fallback or server result)
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-end mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ScanSearch className="text-brand-rust" /> 
            ATS Score Checker
          </h2>
          <p className="text-sm text-gray-500 mt-1">Compare your resume against industry rules & Job Description.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        
        {/* Job Description Input */}
        <div className="bg-white border text-sm border-gray-200 rounded-xl p-4 shadow-sm">
          <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
             <Briefcase size={16} className="text-blue-500" />
             Target Job Description
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
                <div className="bg-blue-100 p-1.5 rounded-full"><RefreshCcw size={14} className="animate-pulse" /></div>
                <span>Lightweight analysis active. Full AI analysis temporarily unavailable.</span>
              </div>
            )}
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-brand-rust to-[#8B4534] rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><CheckCircle size={48} /></div>
                <p className="text-orange-100 text-sm font-medium mb-1">Overall ATS Score</p>
                <div className="text-4xl font-black">{atsData.score}<span className="text-xl text-orange-200 font-bold">/100</span></div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                 <p className="text-gray-500 text-sm font-medium mb-1">Job Match %</p>
                 <div className="text-4xl font-black text-brand-zinc">
                    {atsData.job_match_percentage}%
                 </div>
                 {atsData.job_match_percentage < 50 && jobDescription && (
                    <div className="text-xs text-red-500 mt-2 font-medium bg-red-50 p-1 rounded inline-block">Low Match</div>
                 )}
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
               <div>
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-2">Missing Keywords</h4>
                  {atsData.missing_keywords && atsData.missing_keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                       {atsData.missing_keywords.map(kw => (
                         <span key={kw} className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                            {kw}
                         </span>
                       ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 font-medium">Looking good! No major keywords missing.</p>
                  )}
               </div>

               <div>
                  <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wider mb-2">Matched Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                     {atsData.matched_keywords?.map(kw => (
                       <span key={kw} className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {kw}
                       </span>
                     ))}
                     {(!atsData.matched_keywords || atsData.matched_keywords.length === 0) && (
                       <span className="text-sm text-gray-400">Provide a JD to see matched keywords</span>
                     )}
                  </div>
               </div>
            </div>

            {/* AI Suggestions List */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm">
               <h4 className="font-semibold text-brand-rust flex items-center gap-2 mb-3">
                 <AlertTriangle size={16} /> AI Feedback
               </h4>
               <ul className="space-y-2">
                 {atsData.suggestions?.map((sug, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-brand-rust mt-0.5">•</span>
                      <span>{sug}</span>
                    </li>
                 ))}
               </ul>
            </div>

          </div>
        )}
        
        {!atsData && !loading && (
           <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <ScanSearch className="text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">Add your content & job description and run the scan to see your ATS Score.</p>
           </div>
        )}

      </div>
    </div>
  );
};

export default ATSAnalyzer;
