import React from 'react';
import { useResume } from '../../../context/ResumeContext';

const ClassicTemplate = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills } = resumeData;

  // Classic is completely monochrome for strict ATS parsers that might hallucinate on advanced CSS
  // We use serif fonts typically.
  return (
    <div className="w-full h-full flex flex-col p-12 bg-white text-black font-serif leading-relaxed" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      
      {/* Header */}
      <header className="text-center mb-6 border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personal.fullName || 'YOUR NAME'}</h1>
        <div className="text-sm flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>| {personal.phone}</span>}
          {personal.location && <span>| {personal.location}</span>}
          {personal.linkedin && <span>| {personal.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <p className="text-sm text-justify">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic mb-1">{exp.jobTitle}</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {exp.description ? exp.description.split('\n').filter(b => b.trim()).map((bullet, i) => (
                    <li key={i}>{bullet.trim()}</li>
                  )) : <li>Job description details...</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{proj.title}</span>
                  {proj.link && <span className="text-sm italic">{proj.link}</span>}
                </div>
                <p className="text-sm mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Education</h2>
          <div className="space-y-3">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold">{edu.school}</div>
                  <div className="italic text-sm">{edu.degree}</div>
                </div>
                <span className="font-bold text-sm">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Skills & Technologies</h2>
          <p className="text-sm leading-relaxed">
            {skills.join(' • ')}
          </p>
        </section>
      )}

    </div>
  );
};

export default ClassicTemplate;
