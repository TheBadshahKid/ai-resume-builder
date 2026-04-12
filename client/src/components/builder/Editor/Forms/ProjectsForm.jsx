import React from 'react';
import { useResume } from '../../../../context/ResumeContext';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

const ProjectsForm = () => {
  const { resumeData, updateProjects, addProject, removeProject } = useResume();

  return (
    <div className="space-y-6 pb-20">
      {resumeData.projects.map((proj) => (
        <div key={proj.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group">
          <button 
            onClick={() => removeProject(proj.id)} 
            className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <Trash2 size={16} />
          </button>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Project Title</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => updateProjects(proj.id, 'title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none"
                placeholder="e.g., E-Commerce Dashboard"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <ExternalLink size={11} /> Project Link / URL
              </label>
              <input
                type="text"
                value={proj.link}
                onChange={(e) => updateProjects(proj.id, 'link', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none"
                placeholder="github.com/yourname/project"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description</label>
              <textarea
                value={proj.description}
                onChange={(e) => updateProjects(proj.id, 'description', e.target.value)}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none resize-none text-sm"
                placeholder="Built a real-time dashboard using React and WebSockets, processing 10k daily transactions..."
              />
            </div>
          </div>
        </div>
      ))}

      {resumeData.projects.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-xl">
          No projects yet. Click below to add one!
        </div>
      )}
      
      <button 
        onClick={addProject}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-brand-rust hover:border-brand-rust hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} /> Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
