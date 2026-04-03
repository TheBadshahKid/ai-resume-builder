import React from 'react';
import { useResume } from '../../../context/ResumeContext';

const ModernTemplate = () => {
  const { resumeData, theme } = useResume();
  const { personal, experience, education, skills } = resumeData;

  const accentColor = theme.accentColor || '#A4523D';
  const fontFamily = theme.fontFamily || 'Inter';

  return (
    <div className="w-full h-full flex flex-col p-10 font-sans leading-relaxed text-gray-800" style={{ fontFamily: `${fontFamily}, sans-serif` }}>
      
      {/* Header */}
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
        <h1 className="text-4xl font-black text-brand-zinc tracking-tight uppercase">{personal.fullName || 'YOUR NAME'}</h1>
        <h2 className="text-xl font-medium mt-1" style={{ color: accentColor }}>{personal.jobTitle || 'Professional Title'}</h2>
        
        <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <p className="text-sm text-gray-700 leading-relaxed text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-8">
        
        {/* Left Column: Experience */}
        <div className="col-span-8">
           {experience.length > 0 && (
             <section className="mb-6">
               <h3 className="text-lg font-bold text-brand-rust uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Experience</h3>
               <div className="space-y-5">
                 {experience.map(exp => (
                   <div key={exp.id}>
                     <div className="flex justify-between items-baseline mb-1">
                       <h4 className="font-bold text-gray-900">{exp.jobTitle}</h4>
                       <span className="text-xs font-semibold text-brand-rust bg-orange-50 px-2 py-0.5 rounded">{exp.startDate} – {exp.endDate}</span>
                     </div>
                     <div className="text-sm font-medium text-gray-600 mb-2">{exp.company}</div>
                     <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {exp.description ? exp.description.split('\n').map((bullet, i) => (
                           <span key={i} className="block relative pl-3 before:content-['•'] before:absolute before:left-0 before:text-brand-rust">
                             {bullet.trim()}
                           </span>
                        )) : 'Job description details...'}
                     </p>
                   </div>
                 ))}
               </div>
             </section>
           )}
           
           {/* Projects placeholder (if added later) */}
           {resumeData.projects && resumeData.projects.length > 0 && (
              <section className="mb-6">
                <h3 className="text-lg font-bold text-brand-rust uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Projects</h3>
                <div className="space-y-4">
                  {resumeData.projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-gray-900">{proj.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
           )}
        </div>

        {/* Right Column: Skills & Education */}
        <div className="col-span-4 space-y-6">
          {skills.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-brand-rust uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Skills</h3>
                <div className="flex flex-col gap-1.5">
                   {skills.map((skill, i) => (
                     <div key={i} className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 border-l-2 border-brand-rust">
                        {skill}
                     </div>
                   ))}
                </div>
             </section>
          )}

          {education.length > 0 && (
             <section>
                <h3 className="text-lg font-bold text-brand-rust uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">Education</h3>
                <div className="space-y-4 text-sm">
                   {education.map(edu => (
                     <div key={edu.id}>
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <div className="text-gray-600 font-medium mb-1">{edu.school}</div>
                        <div className="text-xs font-semibold text-gray-500">{edu.startDate} – {edu.endDate}</div>
                     </div>
                   ))}
                </div>
             </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
