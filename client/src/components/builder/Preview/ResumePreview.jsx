import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../../../context/ResumeContext';
import ModernTemplate from '../Templates/ModernTemplate';
import ClassicTemplate from '../Templates/ClassicTemplate';
import MinimalistTemplate from '../Templates/MinimalistTemplate';
import ExecutiveTemplate from '../Templates/ExecutiveTemplate';
import { Download, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const ResumePreview = () => {
  const { activeTemplate, resumeData } = useResume();
  const componentRef = useRef();
  const containerRef = useRef();
  
  // Dynamic scale state
  const [scale, setScale] = useState(1.0);

  // Auto fit-to-width on mount and window resize
  useEffect(() => {
    const fitToWidth = () => {
      if (containerRef.current) {
        // Leave 60px total horizontal padding
        const availableWidth = containerRef.current.clientWidth - 60;
        // Calculate required scale to make 794px fit the available width
        let newScale = availableWidth / 794;
        // Bound the scale between normal readable sizes
        newScale = Math.min(Math.max(newScale, 0.4), 2.5);
        setScale(newScale);
      }
    };

    fitToWidth();
    // Small delay to ensure flex layout has settled
    setTimeout(fitToWidth, 100);

    window.addEventListener('resize', fitToWidth);
    return () => window.removeEventListener('resize', fitToWidth);
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resumeData.personal.fullName || 'Resume'}_ATS`,
  });

  const zoomIn = () => setScale(s => Math.min(s + 0.1, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.4));
  const resetZoom = () => {
    if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 60;
        setScale(availableWidth / 794);
    } else {
        setScale(1.0);
    }
  };

  const renderActiveTemplate = () => {
    switch (activeTemplate) {
      case 'classic': return <ClassicTemplate />;
      case 'minimal': return <MinimalistTemplate />;
      case 'executive': return <ExecutiveTemplate />;
      case 'modern':
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* ── Top Bar ── */}
      <div className="w-full max-w-[794px] flex justify-between items-center mb-6 px-2 shrink-0">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 font-display">Live Preview</h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button onClick={zoomOut} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span className="text-sm font-medium px-2 text-gray-700 dark:text-gray-300 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button onClick={zoomIn} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Zoom In">
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
            <button onClick={resetZoom} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Fit to Screen">
              <Maximize size={16} />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="bg-brand-rust hover:bg-[#8B4534] text-white px-5 py-2.5 rounded-lg shadow-lg shadow-brand-rust/20 flex items-center gap-2 font-medium transition-all transform hover:scale-105"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Overleaf Style Canvas Area ── */}
      <div 
        ref={containerRef}
        className="flex-1 w-full overflow-auto flex justify-center items-start pb-20 custom-scrollbar relative"
      >
        <div 
          className="transition-transform duration-200 flex justify-center"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            marginBottom: `${(1123 * scale) - 1123}px` // Fixes scrollbar cut-off from transform
          }}
        >
          {/* A4 Paper Dimensions (210mm x 297mm) rendered strictly at 794px x 1123px (96dpi) */}
          <div 
            className="bg-white shadow-2xl overflow-hidden print:w-full print:h-full print:shadow-none"
            style={{ width: '794px', minHeight: '1123px' }}
          >
             <div ref={componentRef} className="w-full h-full bg-white text-black p-0 print:m-0 print:p-0">
                {renderActiveTemplate()}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
