import React from 'react';
import { useResume } from '../../../context/ResumeContext';

const ExecutiveTemplate = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, projects, themeColor } = resumeData;

  const accentColor = themeColor || '#1E293B'; // Default to Slate-800

  return (
    <div className="w-full h-full flex flex-col bg-white text-gray-900 font-serif overflow-hidden">
      
      {/* Heavy Header */}
      <header className="px-14 py-10" style={{ backgroundColor: accentColor, color: '#f8fafc' }}>
        <h1 className="text-4xl font-bold tracking-wide uppercase mb-3 font-sans">{personal.fullName || 'YOUR NAME'}</h1>
        <div className="text-sm flex flex-wrap gap-x-6 gap-y-2 opacity-90 font-sans tracking-wide">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      <div className="flex-1 px-14 py-8">
        
        {/* Summary */}
        {personal.summary && (
          <section className="mb-7">
            <p className="text-sm leading-relaxed text-gray-700 italic border-l-4 pl-4" style={{ borderColor: accentColor }}>
              "{personal.summary}"
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-bold uppercase tracking-widest font-sans whitespace-nowrap" style={{ color: accentColor }}>Professional Experience</h2>
              <div className="h-px w-full ml-4 bg-gray-200"></div>
            </div>
            
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-base text-gray-900">{exp.company}</span>
                    <span className="text-xs font-bold text-gray-500 font-sans tracking-wide uppercase">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="italic text-sm text-gray-700 mb-2 font-serif">{exp.jobTitle}</div>
                  <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1.5 marker:text-gray-400">
                    {exp.description ? exp.description.split('\n').filter(b => b.trim()).map((bullet, i) => (
                      <li key={i} className="pl-1 leading-relaxed">{bullet.trim()}</li>
                    )) : <li>Describe achievements and leadership impact.</li>}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-7">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-bold uppercase tracking-widest font-sans whitespace-nowrap" style={{ color: accentColor }}>Key Initiatives</h2>
              <div className="h-px w-full ml-4 bg-gray-200"></div>
            </div>
            <div className="space-y-5">
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-gray-900">{proj.title}</span>
                    {proj.link && <span className="text-xs font-sans text-gray-500">{proj.link}</span>}
                  </div>
                  <p className="text-sm text-gray-700 mt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Skills grid */}
        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-bold uppercase tracking-widest font-sans whitespace-nowrap" style={{ color: accentColor }}>Education</h2>
                <div className="h-px w-full ml-4 bg-gray-200"></div>
              </div>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="font-bold text-gray-900">{edu.school}</div>
                    <div className="text-sm italic text-gray-700 my-0.5">{edu.degree}</div>
                    <div className="text-xs font-bold text-gray-500 font-sans tracking-wide uppercase">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-bold uppercase tracking-widest font-sans whitespace-nowrap" style={{ color: accentColor }}>Core Competencies</h2>
                <div className="h-px w-full ml-4 bg-gray-200"></div>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {skills.join(' • ')}
              </p>
            </section>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExecutiveTemplate;
