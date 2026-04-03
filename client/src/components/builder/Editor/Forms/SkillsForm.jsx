import React, { useState } from 'react';
import { useResume } from '../../../../context/ResumeContext';
import { X, Zap } from 'lucide-react';
import { suggestImprovement } from '../../../../services/api';

const SkillsForm = () => {
  const { resumeData, updateSkills } = useResume();
  const [skillInput, setSkillInput] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !resumeData.skills.includes(skillInput.trim())) {
      updateSkills([...resumeData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateSkills(resumeData.skills.filter(s => s !== skillToRemove));
  };

  const handleGetSuggestions = async () => {
    if (!resumeData.personal.jobTitle) {
      alert("Please enter a Job Title in Personal Info first.");
      return;
    }
    setLoadingSuggestions(true);
    const suggestionMsg = await suggestImprovement(
      'suggest_skills', 
      resumeData.skills.join(', '), 
      resumeData.personal.jobTitle
    );
    
    if (suggestionMsg) {
      // Typically the API returns comma separated skills "Docker, AWS, ..."
      const newSkills = suggestionMsg.split(',').map(s => s.trim()).filter(s => s);
      const uniqueSkills = [...new Set([...resumeData.skills, ...newSkills])];
      updateSkills(uniqueSkills);
    }
    setLoadingSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
        <div>
          <h3 className="font-semibold text-brand-rust">AI Skill Suggestions</h3>
          <p className="text-xs text-orange-800">Based on your title: <span className="font-bold">{resumeData.personal.jobTitle || 'N/A'}</span></p>
        </div>
        <button 
           onClick={handleGetSuggestions}
           disabled={loadingSuggestions}
           className="bg-brand-rust text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50 hover:bg-[#8B4534] transition-colors shadow-sm"
        >
          <Zap size={16} className={loadingSuggestions ? 'animate-pulse' : ''} />
          {loadingSuggestions ? 'Scanning...' : 'Suggest Skills'}
        </button>
      </div>

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input 
          type="text" 
          value={skillInput} 
          onChange={(e) => setSkillInput(e.target.value)} 
          placeholder="e.g., React.js, Python, Project Management" 
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rust outline-none"
        />
        <button type="submit" className="bg-brand-zinc text-white px-6 rounded-lg font-medium hover:bg-gray-800 transition">
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2 pt-2">
        {resumeData.skills.map((skill, i) => (
          <div key={i} className="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm">
            <span>{skill}</span>
            <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
          </div>
        ))}
        {resumeData.skills.length === 0 && (
           <p className="text-gray-400 text-sm italic w-full text-center py-4">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
