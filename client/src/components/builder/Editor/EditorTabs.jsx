import React, { useState } from 'react';
import PersonalForm from './Forms/PersonalForm';
import ExperienceForm from './Forms/ExperienceForm';
import EducationForm from './Forms/EducationForm';
import SkillsForm from './Forms/SkillsForm';
import ThemeForm from './Forms/ThemeForm';

const EditorTabs = ({ activeTab }) => {
  return (
    <div className="h-full flex flex-col p-6">
       <h2 className="text-2xl font-bold mb-6 text-gray-800 capitalize border-b pb-4">
         {activeTab} Section
       </h2>
       
       <div className="flex-1 overflow-y-auto pr-2">
         {activeTab === 'personal' && <PersonalForm />}
         {activeTab === 'experience' && <ExperienceForm />}
         {activeTab === 'education' && <EducationForm />}
         {activeTab === 'skills' && <SkillsForm />}
         {activeTab === 'theme' && <ThemeForm />}
         {activeTab === 'projects' && (
           <div className="text-gray-500 italic p-4 text-center border-2 border-dashed rounded-lg">
             Project section coming soon...
           </div>
         )}
       </div>
    </div>
  );
};

export default EditorTabs;
