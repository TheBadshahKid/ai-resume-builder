import React from 'react';
import { useResume } from '../../../../context/ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
  const { resumeData, updateEducation, addEducation, removeEducation } = useResume();

  return (
    <div className="space-y-6 pb-20">
      {resumeData.education.map((edu) => (
        <div key={edu.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
          <button 
            onClick={() => removeEducation(edu.id)} 
            className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Degree / Certificate</label>
              <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">School / University</label>
              <input type="text" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
              <input type="text" placeholder="MM/YYYY" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
              <input type="text" placeholder="MM/YYYY" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust" />
            </div>
          </div>
        </div>
      ))}
      
      <button 
        onClick={addEducation}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-brand-rust hover:border-brand-rust hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} /> Add Education
      </button>
    </div>
  );
};

export default EducationForm;
