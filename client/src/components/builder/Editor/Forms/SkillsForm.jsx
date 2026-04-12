import React, { useState } from 'react';
import { useResume } from '../../../../context/ResumeContext';
import { X, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { suggestImprovement } from '../../../../services/api';

const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium shadow-sm border animate-in slide-in-from-bottom-2 duration-300 ${
    type === 'success'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200'
  }`}>
    {type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    {message}
    <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
      <X size={14} />
    </button>
  </div>
);

const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skillInput, setSkillInput] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    
    // Case-insensitive duplicate check
    const isDuplicate = resumeData.skills.some(
      s => s.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (isDuplicate) {
      showToast(`"${trimmed}" is already in your skills list.`, 'error');
    } else {
      updateSkills([...resumeData.skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateSkills(resumeData.skills.filter(s => s !== skillToRemove));
  };

  const handleGetSuggestions = async () => {
    if (!resumeData.personal.jobTitle) {
      showToast('Please add a Job Title in Personal Info first.', 'error');
      return;
    }
    setLoadingSuggestions(true);
    const suggestionMsg = await suggestImprovement(
      'suggest_skills', 
      resumeData.skills.join(', '), 
      resumeData.personal.jobTitle
    );
    
    if (suggestionMsg) {
      // Split by comma, trim whitespace
      const newSkills = suggestionMsg.split(',').map(s => s.trim()).filter(Boolean);
      // Case-insensitive deduplication
      const existingLower = new Set(resumeData.skills.map(s => s.toLowerCase()));
      const uniqueNew = newSkills.filter(s => !existingLower.has(s.toLowerCase()));
      
      if (uniqueNew.length > 0) {
        updateSkills([...resumeData.skills, ...uniqueNew]);
        showToast(`Added ${uniqueNew.length} new skill${uniqueNew.length > 1 ? 's' : ''}: ${uniqueNew.join(', ')}`);
      } else {
        showToast('You already have all suggested skills! Great coverage.', 'error');
      }
    } else {
      showToast('Could not fetch suggestions. Please try again.', 'error');
    }
    setLoadingSuggestions(false);
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* AI Suggestion Banner */}
      <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
        <div>
          <h3 className="font-semibold text-brand-rust">AI Skill Suggestions</h3>
          <p className="text-xs text-orange-800">
            Based on your title: <span className="font-bold">{resumeData.personal.jobTitle || 'N/A (set in Personal Info)'}</span>
          </p>
        </div>
        <button 
           onClick={handleGetSuggestions}
           disabled={loadingSuggestions}
           className="bg-brand-rust text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50 hover:bg-[#8B4534] transition-colors shadow-sm whitespace-nowrap"
        >
          <Zap size={16} className={loadingSuggestions ? 'animate-pulse' : ''} />
          {loadingSuggestions ? 'Scanning...' : 'Suggest Skills'}
        </button>
      </div>

      {/* Add Skill Input */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input 
          type="text" 
          value={skillInput} 
          onChange={(e) => setSkillInput(e.target.value)} 
          placeholder="e.g., React.js, Python, Project Management" 
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rust outline-none"
        />
        <button 
          type="submit" 
          className="bg-brand-zinc text-white px-6 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Add
        </button>
      </form>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-2 pt-1">
        {resumeData.skills.map((skill, i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm group hover:bg-orange-50 hover:border-orange-200 transition-colors">
            <span>{skill}</span>
            <button 
              type="button" 
              onClick={() => handleRemoveSkill(skill)} 
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {resumeData.skills.length === 0 && (
           <p className="text-gray-400 text-sm italic w-full text-center py-4">
             No skills added yet. Add manually or use AI suggestions.
           </p>
        )}
      </div>

      {/* Skill Count */}
      {resumeData.skills.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {resumeData.skills.length} skill{resumeData.skills.length !== 1 ? 's' : ''} · ATS recommends 8–15
        </p>
      )}
    </div>
  );
};

export default SkillsForm;
