import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { FileText, Layout, CheckCircle, Lightbulb, Briefcase, GraduationCap, Code } from 'lucide-react';
import EditorTabs from './Editor/EditorTabs';
import ATSAnalyzer from './Editor/ATSAnalyzer';
import ResumePreview from './Preview/ResumePreview';

const ResumeBuilder = () => {
  const { resumeData, activeTemplate, setActiveTemplate, atsData } = useResume();
  const [activeTab, setActiveTab] = useState('personal'); // personal, experience, education, skills, ats

  const renderLeftPanel = () => {
    switch (activeTab) {
      case 'personal':
      case 'experience':
      case 'education':
      case 'skills':
      case 'theme':
      case 'projects':
        return <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'ats':
        return <ATSAnalyzer />;
      case 'templates':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-brand-rust">ATS-Friendly Templates</h2>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'modern' ? 'border-brand-rust' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setActiveTemplate('modern')}
              >
                <div className="h-32 bg-gray-200"></div> {/* Placeholder for preview thumb */}
                <div className="bg-brand-zinc p-3 text-center font-medium">Modern Glass</div>
              </div>
              <div 
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${activeTemplate === 'classic' ? 'border-brand-rust' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setActiveTemplate('classic')}
              >
                <div className="h-32 bg-gray-200"></div>
                <div className="bg-brand-zinc p-3 text-center font-medium">Classic ATS</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { id: 'personal', icon: <FileText size={18} />, label: 'Info' },
    { id: 'experience', icon: <Briefcase size={18} />, label: 'Experience' },
    { id: 'education', icon: <GraduationCap size={18} />, label: 'Education' },
    { id: 'skills', icon: <Code size={18} />, label: 'Skills' },
    { id: 'theme', icon: <Layout size={18} />, label: 'Design' },
    { id: 'templates', icon: <Layout size={18} />, label: 'Layout' },
    { id: 'ats', icon: <CheckCircle size={18} />, label: 'ATS Score', highlight: true },
  ];

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      {/* Left Sidebar Menu */}
      <div className="w-20 lg:w-48 bg-brand-zinc text-gray-400 py-6 flex flex-col items-center lg:items-start border-r border-gray-800">
        <div className="w-full space-y-2 px-2 lg:px-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? item.highlight ? 'bg-brand-rust text-white shadow-lg shadow-brand-rust/30' : 'bg-gray-800 text-white' 
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className={activeTab === item.id ? 'animate-pulse' : ''}>{item.icon}</div>
              <span className="ml-3 hidden lg:block font-medium text-sm w-full flex justify-between items-center">
                {item.label}
                {item.id === 'ats' && atsData && (
                  <span className="bg-white text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {atsData.score}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Panel */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto bg-white border-r border-gray-200 shadow-xl z-10">
        {renderLeftPanel()}
      </div>

      {/* Preview Panel */}
      <div className="hidden lg:flex flex-1 h-full bg-gray-200 p-8 overflow-y-auto items-start justify-center">
         <ResumePreview />
      </div>
    </div>
  );
};

export default ResumeBuilder;
