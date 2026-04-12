import React, { useState } from 'react';
import { useResume } from '../../../../context/ResumeContext';
import { Plus, Trash2, Zap, GripVertical, Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { suggestImprovement } from '../../../../services/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Toast = ({ message, type = 'success' }) => (
  <div className={`text-xs font-medium flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border animate-in slide-in-from-top-1 duration-200 ${
    type === 'success'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200'
  }`}>
    {type === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
    {message}
  </div>
);

const SortableExperienceItem = ({
  exp, updateExperience, removeExperience,
  handleAIImprove, improvingId, handleAutoGenerate, generatingId, toast, toastId
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group flex gap-3">
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab pt-2 text-gray-400 hover:text-brand-rust">
        <GripVertical size={20} />
      </div>

      <div className="flex-1">
        <button 
          onClick={() => removeExperience(exp.id)} 
          className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
        >
          <Trash2 size={16} />
        </button>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Job Title</label>
            <input
              type="text"
              value={exp.jobTitle}
              onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none pr-8"
            />
            {exp.jobTitle.length > 2 && (
              <button 
                onClick={() => handleAutoGenerate(exp)}
                disabled={generatingId === exp.id}
                title="Auto-generate ATS-friendly bullet points for this role"
                className="absolute right-2 top-8 text-brand-rust hover:text-orange-500 disabled:opacity-50 transition-colors"
              >
                <Sparkles size={16} className={generatingId === exp.id ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Company</label>
            <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Start Date</label>
            <input type="text" placeholder="MM/YYYY" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
            <input type="text" placeholder="MM/YYYY or Present" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-brand-rust outline-none" />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
            <div className="flex justify-between items-center w-full">
              <span>Description / Bullets</span>
              <div className="flex items-center gap-2">
                {/* Inline toast feedback */}
                {toastId === exp.id && toast && <Toast message={toast.message} type={toast.type} />}
                <button 
                    onClick={() => handleAIImprove(exp)}
                    disabled={improvingId === exp.id || !exp.description}
                    className="flex items-center gap-1 text-[10px] bg-brand-zinc text-brand-rust px-2 py-1 rounded hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  <Zap size={12} className={improvingId === exp.id ? 'animate-pulse' : ''} />
                  {improvingId === exp.id ? 'Improving...' : 'Smart Improve'}
                </button>
              </div>
            </div>
          </label>
          <textarea 
              value={exp.description} 
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} 
              rows="4" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rust outline-none block text-sm"
              placeholder="Developed XYZ which increased revenue by 20%..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

const ExperienceForm = () => {
  const { resumeData, updateExperience, addExperience, removeExperience, reorderExperience } = useResume();
  const [improvingId, setImprovingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [toastId, setToastId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = resumeData.experience.findIndex((item) => item.id === active.id);
      const newIndex = resumeData.experience.findIndex((item) => item.id === over.id);
      reorderExperience(oldIndex, newIndex);
    }
  };

  const showToast = (id, message, type = 'success') => {
    setToastId(id);
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
      setToastId(null);
    }, 3000);
  };

  const handleAIImprove = async (exp) => {
    if (!exp.description) return;
    setImprovingId(exp.id);
    const suggestion = await suggestImprovement('improve_bullet', exp.description, exp.jobTitle);
    if (suggestion) {
      updateExperience(exp.id, 'description', suggestion);
      showToast(exp.id, 'Bullet improved!', 'success');
    } else {
      showToast(exp.id, 'Could not reach AI. Try again.', 'error');
    }
    setImprovingId(null);
  };

  const handleAutoGenerate = async (exp) => {
    setGeneratingId(exp.id);
    const suggestion = await suggestImprovement('generate_experience', exp.jobTitle, '');
    if (suggestion) {
      updateExperience(exp.id, 'description', suggestion);
      showToast(exp.id, 'Bullets generated!', 'success');
    } else {
      showToast(exp.id, 'Could not generate. Try again.', 'error');
    }
    setGeneratingId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-orange-50 border border-brand-rust/20 p-3 rounded-lg flex items-start gap-3 mb-2 text-sm text-brand-zinc">
        <Sparkles className="text-brand-rust flex-shrink-0 mt-0.5" size={18} />
        <div>
           <strong>Pro Tip:</strong> Enter a Job Title and click the sparkle icon (<Sparkles size={14} className="inline text-brand-rust mx-0.5" />) to instantly generate tailored, ATS-friendly bullet points!
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={resumeData.experience.map(e => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <SortableExperienceItem 
                key={exp.id} 
                exp={exp} 
                updateExperience={updateExperience}
                removeExperience={removeExperience}
                handleAIImprove={handleAIImprove}
                improvingId={improvingId}
                handleAutoGenerate={handleAutoGenerate}
                generatingId={generatingId}
                toast={toast}
                toastId={toastId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <button 
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-brand-rust hover:border-brand-rust hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Plus size={20} /> Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
