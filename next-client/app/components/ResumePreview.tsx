"use client";

import { useState } from "react";
import { Download, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Mock resume data rendered as a styled HTML preview (simulating LaTeX output)
const MOCK_RESUME = {
  name: "Jane Doe",
  title: "Senior Software Engineer",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/janedoe",
  summary:
    "Detail-oriented and innovative Senior Software Engineer with 5+ years of experience in developing scalable web applications. Proficient in React, Node.js, and cloud architectures.",
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovators Inc.",
      dates: "Mar 2021 – Present",
      bullets: [
        "Led a team of 4 frontend developers to migrate a legacy AngularJS application to React, improving load times by 40% and increasing user engagement by 25%.",
        "Implemented a robust design system using Tailwind CSS and Storybook, reducing UI development time by 30% across 3 product teams.",
        "Architected state management using Redux Toolkit, resolving complex synchronization issues across multiple views.",
      ],
    },
    {
      title: "Web Developer",
      company: "Creative Solutions",
      dates: "Jun 2018 – Feb 2021",
      bullets: [
        "Developed responsive, mobile-first web applications using HTML5, CSS3, and JavaScript for 12+ client projects.",
        "Integrated third-party APIs for payment processing (Stripe) and geolocation, enhancing platform functionality.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Sc. in Computer Science",
      school: "University of California, Berkeley",
      dates: "Aug 2014 – May 2018",
    },
  ],
  skills: [
    "JavaScript (ES6+)", "React.js", "Node.js", "TypeScript", "Tailwind CSS",
    "PostgreSQL", "Docker", "AWS", "Git", "CI/CD",
  ],
};

export default function ResumePreview() {
  const [zoom, setZoom] = useState(0.72);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleRecompile = () => {
    setIsCompiling(true);
    setTimeout(() => setIsCompiling(false), 1500);
  };

  const handleDownload = () => {
    // Add temporary print class to body if needed
    window.print();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-secondary/50">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRecompile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-bg-tertiary border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-rust/40 transition-all"
          >
            <RefreshCw size={12} className={isCompiling ? "animate-spin" : ""} />
            {isCompiling ? "Compiling..." : "Recompile"}
          </button>
          <span className="text-[10px] text-text-muted font-mono">
            {isCompiling ? "pdflatex ▸ running..." : "xelatex ▸ ready"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
            className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono text-text-muted w-10 text-center tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}
            className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
          >
            <ZoomIn size={14} />
          </button>
          <button className="p-1.5 text-text-muted hover:text-text-primary transition-colors ml-1">
            <Maximize2 size={14} />
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 ml-3 px-3 py-1.5 text-xs rounded-lg bg-accent-rust text-white hover:bg-accent-rust-hover transition-all font-medium"
          >
            <Download size={12} />
            PDF
          </button>
        </div>
      </div>

      {/* PDF Canvas Area */}
      <div className="flex-1 overflow-auto bg-bg-primary/50 flex items-start justify-center p-6">
        {isCompiling ? (
          <div className="w-[595px] bg-bg-tertiary rounded-sm shadow-2xl" style={{ aspectRatio: "210/297" }}>
            <div className="p-10 space-y-6">
              <div className="shimmer h-8 w-48 rounded" />
              <div className="shimmer h-4 w-72 rounded" />
              <div className="shimmer h-4 w-64 rounded" />
              <div className="space-y-3 mt-8">
                <div className="shimmer h-3 w-full rounded" />
                <div className="shimmer h-3 w-5/6 rounded" />
                <div className="shimmer h-3 w-4/6 rounded" />
              </div>
              <div className="space-y-3 mt-6">
                <div className="shimmer h-5 w-36 rounded" />
                <div className="shimmer h-3 w-full rounded" />
                <div className="shimmer h-3 w-5/6 rounded" />
                <div className="shimmer h-3 w-4/5 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="bg-white text-black rounded-sm shadow-2xl shadow-black/40 origin-top transition-transform duration-300 print-area"
            style={{
              width: 595,
              minHeight: 842,
              transform: `scale(${zoom})`,
              fontFamily: "'Times New Roman', 'Georgia', serif",
            }}
          >
            {/* LaTeX-style resume rendering */}
            <div className="px-12 py-10">
              {/* Name & Contact */}
              <div className="text-center border-b-2 border-black pb-3 mb-4">
                <h1 className="text-2xl font-bold tracking-wide uppercase">
                  {MOCK_RESUME.name}
                </h1>
                <p className="text-sm mt-1 text-gray-700">
                  {MOCK_RESUME.title}
                </p>
                <p className="text-[10px] mt-1.5 text-gray-500 tracking-wide">
                  {MOCK_RESUME.email} · {MOCK_RESUME.phone} · {MOCK_RESUME.location} · {MOCK_RESUME.linkedin}
                </p>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-300 pb-0.5 mb-2">
                  Professional Summary
                </h2>
                <p className="text-[10.5px] leading-relaxed text-gray-800">
                  {MOCK_RESUME.summary}
                </p>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-300 pb-0.5 mb-2">
                  Experience
                </h2>
                {MOCK_RESUME.experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-bold">{exp.title}</span>
                      <span className="text-[9px] text-gray-500 italic">{exp.dates}</span>
                    </div>
                    <p className="text-[10px] italic text-gray-600 mb-1">{exp.company}</p>
                    <ul className="list-none space-y-0.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-[10px] leading-snug text-gray-800 pl-3 relative before:content-['▸'] before:absolute before:left-0 before:text-gray-400">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-300 pb-0.5 mb-2">
                  Education
                </h2>
                {MOCK_RESUME.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div>
                      <span className="text-[11px] font-bold">{edu.degree}</span>
                      <span className="text-[10px] text-gray-600 ml-2">{edu.school}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 italic">{edu.dates}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] border-b border-gray-300 pb-0.5 mb-2">
                  Technical Skills
                </h2>
                <p className="text-[10px] text-gray-800">
                  {MOCK_RESUME.skills.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            transform: scale(1) !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
