import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

const initialResumeData = {
  personal: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'Detail-oriented and innovative Senior Software Engineer with 5+ years of experience in developing scalable web applications. Proficient in React, Node.js, and cloud architectures. Strong track record of improving application performance and leading cross-functional teams.'
  },
  experience: [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Innovators Inc.',
      startDate: '2021-03',
      endDate: 'Present',
      description: 'Led a team of 4 frontend developers to migrate a legacy AngularJS application to React, improving load times by 40% and increasing user engagement.\nImplemented a robust design system using Tailwind CSS and Storybook, reducing UI development time by 30%.\nArchitected state management using Redux Toolkit, resolving complex synchronization issues across multiple views.'
    },
    {
      id: '2',
      jobTitle: 'Web Developer',
      company: 'Creative Solutions',
      startDate: '2018-06',
      endDate: '2021-02',
      description: 'Developed responsive, mobile-first web applications using HTML5, CSS3, and JavaScript.\nCollaborated closely with UI/UX designers to translate Figma mockups into pixel-perfect implementations.\nIntegrated third-party APIs for payment processing and geolocation, enhancing platform functionality.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.Sc. in Computer Science',
      school: 'University of California, Berkeley',
      startDate: '2014-08',
      endDate: '2018-05'
    }
  ],
  skills: ['JavaScript (ES6+)', 'React.js', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Agile Methodology'],
  projects: [
    {
      id: '1',
      title: 'E-commerce Dashboard',
      link: 'github.com/janedoe/ecommerce',
      description: 'Built a real-time analytics dashboard for e-commerce administrators using React, WebSockets, and Chart.js. Processed and visualized over 10,000 daily transactions.'
    }
  ]
};

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [atsData, setAtsData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('modern'); // 'modern' or 'classic'

  const [theme, setTheme] = useState({
    accentColor: '#A4523D', // Default Rust
    fontFamily: 'Inter',
  });

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const addExperience = () => {
    setResumeData(prev => ({
       ...prev,
       experience: [...prev.experience, { id: Date.now().toString(), jobTitle: '', company: '', startDate: '', endDate: '', description: '' }]
    }));
  }

  const removeExperience = (id) => {
    setResumeData(prev => ({
       ...prev,
       experience: prev.experience.filter(exp => exp.id !== id)
    }));
  }

  const reorderExperience = (startIndex, endIndex) => {
    setResumeData(prev => {
      const result = Array.from(prev.experience);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, experience: result };
    });
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };
  
  const addEducation = () => {
    setResumeData(prev => ({
       ...prev,
       education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', startDate: '', endDate: '' }]
    }));
  }

  const removeEducation = (id) => {
    setResumeData(prev => ({
       ...prev,
       education: prev.education.filter(edu => edu.id !== id)
    }));
  }

  const updateProjects = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  };
  
  const addProject = () => {
    setResumeData(prev => ({
       ...prev,
       projects: [...prev.projects, { id: Date.now().toString(), title: '', link: '', description: '' }]
    }));
  }

  const removeProject = (id) => {
    setResumeData(prev => ({
       ...prev,
       projects: prev.projects.filter(proj => proj.id !== id)
    }));
  }

  const updateSkills = (newSkills) => {
    setResumeData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  return (
    <ResumeContext.Provider value={{ 
      resumeData, 
      setResumeData,
      updatePersonalInfo,
      updateExperience, addExperience, removeExperience, reorderExperience,
      updateEducation, addEducation, removeEducation,
      updateProjects, addProject, removeProject,
      updateSkills,
      atsData, setAtsData,
      jobDescription, setJobDescription,
      activeTemplate, setActiveTemplate,
      theme, setTheme
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
