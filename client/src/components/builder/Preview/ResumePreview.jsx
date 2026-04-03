import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../../../context/ResumeContext';
import ModernTemplate from '../Templates/ModernTemplate';
import ClassicTemplate from '../Templates/ClassicTemplate';
import { Download } from 'lucide-react';

const ResumePreview = () => {
  const { activeTemplate, resumeData } = useResume();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resumeData.personal.fullName || 'Resume'}_ATS`,
  });

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <div className="w-full flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Live Preview</h3>
        <button
          onClick={handlePrint}
          className="bg-brand-rust hover:bg-[#8B4534] text-white px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 font-medium transition-all transform hover:scale-105"
        >
          <Download size={18} />
          Export ATS PDF
        </button>
      </div>

      {/* A4 Paper Container Wrapper for scale/shadow */}
      <div className="w-full bg-white shadow-2xl overflow-hidden rounded-sm" style={{ aspectRatio: '210/297' }}>
         <div ref={componentRef} className="w-full h-full bg-white text-black p-0 print:m-0 print:p-0">
            {/* The actual templates */}
            {activeTemplate === 'modern' ? <ModernTemplate /> : <ClassicTemplate />}
         </div>
      </div>
    </div>
  );
};

export default ResumePreview;
