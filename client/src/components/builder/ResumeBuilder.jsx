import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import {
  FileText, Layout, CheckCircle, Briefcase, GraduationCap,
  Code, Folder, ScanSearch, Palette
} from 'lucide-react';
import EditorTabs from './Editor/EditorTabs';
import ATSAnalyzer from './Editor/ATSAnalyzer';
import ResumePreview from './Preview/ResumePreview';

const navItems = [
  { id: 'personal',   icon: <FileText size={17} />,      label: 'Personal' },
  { id: 'experience', icon: <Briefcase size={17} />,     label: 'Experience' },
  { id: 'education',  icon: <GraduationCap size={17} />, label: 'Education' },
  { id: 'skills',     icon: <Code size={17} />,          label: 'Skills' },
  { id: 'projects',   icon: <Folder size={17} />,        label: 'Projects' },
  { id: 'theme',      icon: <Palette size={17} />,       label: 'Design' },
  { id: 'templates',  icon: <Layout size={17} />,        label: 'Layout' },
  { id: 'ats',        icon: <ScanSearch size={17} />,    label: 'ATS Score', highlight: true },
];

const ResumeBuilder = () => {
  const { resumeData, activeTemplate, setActiveTemplate, atsData } = useResume();
  const [activeTab, setActiveTab] = useState('personal');

  const renderLeftPanel = () => {
    if (activeTab === 'ats') return <ATSAnalyzer />;

    if (activeTab === 'templates') {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-800 font-display">Choose a Layout</h2>
          <p className="text-sm text-gray-500 mb-6">All templates are ATS-friendly and recruiter-approved.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'modern', label: 'Modern Glass', desc: 'Clean sidebar design' },
              { id: 'classic', label: 'Classic ATS', desc: 'Traditional format' }
            ].map(t => (
              <div
                key={t.id}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  activeTemplate === t.id
                    ? 'border-brand-rust shadow-lg shadow-brand-rust/10'
                    : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
                }`}
                onClick={() => setActiveTemplate(t.id)}
              >
                <div className={`h-28 flex items-center justify-center ${
                  activeTemplate === t.id ? 'bg-orange-50' : 'bg-gray-100'
                }`}>
                  <FileText size={36} className={activeTemplate === t.id ? 'text-brand-rust' : 'text-gray-400'} />
                </div>
                <div className="p-3 bg-white border-t border-gray-100">
                  <div className="font-semibold text-gray-800 text-sm">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />;
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#111113]">

      {/* ── Sidebar ── */}
      <div className="w-[62px] lg:w-52 bg-[#18181A] border-r border-white/5 flex flex-col py-4">
        {/* Logo mark */}
        <div className="px-3 lg:px-4 mb-6 hidden lg:flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-rust rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm font-display">Resume<span className="text-brand-rust">AI</span></span>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center lg:gap-3 gap-0 justify-center lg:justify-start p-3 rounded-xl transition-all text-left ${
                activeTab === item.id
                  ? item.highlight
                    ? 'bg-brand-rust text-white shadow-lg shadow-brand-rust/25'
                    : 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="hidden lg:flex flex-1 justify-between items-center text-sm font-medium">
                {item.label}
                {item.id === 'ats' && atsData && (
                  <span className="bg-white text-brand-rust text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
                    {atsData.score}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom hint */}
        <div className="px-3 pb-2 hidden lg:block">
          <div className="text-[10px] text-gray-700 text-center">
            Draft auto-saved in state
          </div>
        </div>
      </div>

      {/* ── Editor Panel ── */}
      <div className="w-full lg:w-[42%] h-full overflow-y-auto bg-white border-r border-gray-100 shadow-2xl z-10">
        {renderLeftPanel()}
      </div>

      {/* ── Preview Panel ── */}
      <div className="hidden lg:flex flex-1 h-full bg-[#1a1a1d] p-8 overflow-y-auto items-start justify-center">
        <ResumePreview />
      </div>
    </div>
  );
};

export default ResumeBuilder;
