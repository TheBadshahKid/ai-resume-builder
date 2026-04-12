import React from 'react';
import PersonalForm from './Forms/PersonalForm';
import ExperienceForm from './Forms/ExperienceForm';
import EducationForm from './Forms/EducationForm';
import SkillsForm from './Forms/SkillsForm';
import ThemeForm from './Forms/ThemeForm';
import ProjectsForm from './Forms/ProjectsForm';

const TAB_TITLES = {
  personal: 'Personal Info',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  theme: 'Design & Theme',
  projects: 'Projects',
};

const EditorTabs = ({ activeTab }) => {
  return (
    <div className="h-full flex flex-col p-6">
       <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
         {TAB_TITLES[activeTab] || activeTab}
       </h2>
       
       <div className="flex-1 overflow-y-auto pr-2">
         {activeTab === 'personal' && <PersonalForm />}
         {activeTab === 'experience' && <ExperienceForm />}
         {activeTab === 'education' && <EducationForm />}
         {activeTab === 'skills' && <SkillsForm />}
         {activeTab === 'theme' && <ThemeForm />}
         {activeTab === 'projects' && <ProjectsForm />}
       </div>
    </div>
  );
};

export default EditorTabs;
