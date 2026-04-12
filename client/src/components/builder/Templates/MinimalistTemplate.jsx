import React from 'react';
import { useResume } from '../../../context/ResumeContext';

const MinimalistTemplate = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, projects, themeColor } = resumeData;

  const accentColor = themeColor || '#4F46E5';

  return (
    <div className="w-full h-full flex flex-col p-14 bg-white text-gray-800 font-sans leading-relaxed tracking-wide">
      
      {/* Header */}
      <header className="mb-10 text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{personal.fullName || 'Your Name'}</h1>
        <div className="text-sm font-medium text-gray-500 flex flex-wrap gap-x-5 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-8">
          <p className="text-[13px] text-gray-600 leading-relaxed max-w-[90%]">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Experience</h2>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-gray-900">{exp.jobTitle}</span>
                  <span className="text-xs font-semibold text-gray-400 tabular-nums uppercase">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-[13px] text-gray-500 mb-2">{exp.company}</div>
                <ul className="list-disc pl-4 text-[13px] text-gray-600 space-y-1.5 marker:text-gray-300">
                  {exp.description ? exp.description.split('\n').filter(b => b.trim()).map((bullet, i) => (
                    <li key={i}>{bullet.trim()}</li>
                  )) : <li>List your key responsibilities and impact.</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Projects</h2>
          <div className="space-y-5">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-gray-900">{proj.title}</span>
                  {proj.link && <span className="text-xs text-gray-400">{proj.link}</span>}
                </div>
                <p className="text-[13px] text-gray-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Education</h2>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-semibold text-gray-900">{edu.school}</div>
                  <div className="text-[13px] text-gray-500 mt-0.5">{edu.degree}</div>
                </div>
                <span className="text-xs font-semibold text-gray-400 tabular-nums uppercase">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="text-[13px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md font-medium border border-gray-100">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default MinimalistTemplate;
