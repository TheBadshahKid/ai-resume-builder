"use client";

import { useState } from "react";
import ChatPrompt from "./components/ChatPrompt";
import HireabilityScore from "./components/HireabilityScore";
import ResumePreview from "./components/ResumePreview";
import {
  FileText,
  Sparkles,
  ChevronRight,
  Terminal,
  Braces,
  Code2,
} from "lucide-react";

export default function Home() {
  const [score, setScore] = useState(62);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showArch, setShowArch] = useState(false);

  const handlePromptMessage = (msg: string) => {
    const lower = msg.toLowerCase();
    if (lower.includes("ats") || lower.includes("keyword") || lower.includes("score")) {
      setScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 15) + 10));
    } else if (lower.includes("star") || lower.includes("rewrite")) {
      setScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 10) + 5));
    } else if (lower.includes("theme") || lower.includes("font")) {
      setScore((prev) => Math.min(100, prev + 3));
    } else {
      setScore((prev) => Math.min(100, prev + Math.floor(Math.random() * 5) + 2));
    }
  };

  // Landing Page
  if (!showBuilder) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-primary relative overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-rust/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent-violet/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="fixed top-[30%] right-[20%] w-[300px] h-[300px] bg-accent-emerald/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border-subtle/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-rust/20 flex items-center justify-center">
              <Braces size={16} className="text-accent-rust" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">
              ResumeForge
            </span>
            <span className="text-[10px] font-mono bg-accent-rust/15 text-accent-rust px-2 py-0.5 rounded-full ml-1">
              AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Docs
            </a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
              <Code2 size={14} /> GitHub
            </a>
            <button
              onClick={() => setShowBuilder(true)}
              className="text-sm font-medium bg-accent-rust text-white px-5 py-2 rounded-xl hover:bg-accent-rust-hover transition-all shadow-lg shadow-accent-rust/20"
            >
              Launch Builder
            </button>
          </div>
        </nav>

        {/* Hero */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="animate-pulse-ring mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-border bg-bg-secondary flex items-center justify-center">
              <Sparkles size={28} className="text-accent-rust" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
            <span className="text-text-primary">Build resumes with </span>
            <span className="bg-gradient-to-r from-accent-rust via-accent-violet to-accent-emerald bg-clip-text text-transparent">
              prompts, not forms.
            </span>
          </h1>

          <p className="mt-5 text-lg text-text-secondary max-w-xl leading-relaxed">
            Tell the AI what you want. It rewrites your content using the{" "}
            <span className="text-accent-emerald font-medium">STAR method</span>,
            optimizes for{" "}
            <span className="text-accent-amber font-medium">ATS keywords</span>,
            and renders a{" "}
            <span className="text-accent-violet font-medium">pixel-perfect LaTeX PDF</span>{" "}
            — all from natural language.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => setShowBuilder(true)}
              className="flex items-center gap-2 px-7 py-3.5 bg-accent-rust text-white rounded-xl font-semibold text-sm hover:bg-accent-rust-hover transition-all shadow-lg shadow-accent-rust/25 group"
            >
              Start Building
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
            <button 
              onClick={() => setShowArch(true)}
              className="flex items-center gap-2 px-7 py-3.5 border border-border-subtle text-text-secondary rounded-xl font-medium text-sm hover:border-border-accent hover:text-text-primary transition-all bg-bg-secondary/50"
            >
              <Terminal size={14} />
              View Architecture
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {[
              { label: "Prompt-Based Editor", color: "accent-rust" },
              { label: "LaTeX PDF Engine", color: "accent-violet" },
              { label: "STAR Auto-Rewriter", color: "accent-emerald" },
              { label: "Gamified ATS Score", color: "accent-amber" },
              { label: "Dark Mode Native", color: "text-secondary" },
            ].map((f) => (
              <span
                key={f.label}
                className={`text-xs font-medium px-4 py-2 rounded-full border border-border-subtle bg-bg-secondary text-${f.color}`}
              >
                {f.label}
              </span>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 border-t border-border-subtle/50">
          <p className="text-xs text-text-muted">
            Powered by Next.js · LangChain · TeX-Live ·{" "}
            <span className="text-accent-rust">AI that actually ships.</span>
          </p>
        </footer>

        {/* Architecture Modal */}
        {showArch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-bg-secondary border border-border-accent w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
              <button 
                onClick={() => setShowArch(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                ✕
              </button>
              <div className="p-8">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <Terminal className="text-accent-rust" /> System Architecture
                </h3>
                <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
                  <div className="p-4 bg-bg-primary rounded-xl border border-border-subtle font-mono text-[11px] space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-accent-rust">Frontend</span>
                      <span className="text-text-muted">→</span>
                      <span>Next.js 16 (Dark Editor UI)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-accent-violet">AI Orchestrator</span>
                      <span className="text-text-muted">→</span>
                      <span>FastAPI + LangChain (STAR Rewriter)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-accent-emerald">Parser</span>
                      <span className="text-text-muted">→</span>
                      <span>Python Flask + Spacy (ATS Scorer)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-24 text-accent-amber">PDF Engine</span>
                      <span className="text-text-muted">→</span>
                      <span>TeX-Live (LaTeX Compiler Microservice)</span>
                    </div>
                  </div>
                  <p>
                    The architecture is designed to disrupt legacy tools like Overleaf by decoupling the complex LaTeX logic from the UI. 
                    Your natural language prompts are parsed by LangChain, which then dictates the precise LaTeX tags to the TeX-Live microservice for pixel-perfect rendering.
                  </p>
                </div>
                <button 
                  onClick={() => setShowArch(false)}
                  className="mt-8 w-full py-3 bg-bg-tertiary border border-border-subtle rounded-xl font-semibold hover:border-accent-rust transition-all"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Builder View — Split Pane
  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border-subtle bg-bg-secondary/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBuilder(false)}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-accent-rust/20 flex items-center justify-center">
              <Braces size={14} className="text-accent-rust" />
            </div>
            <span className="font-bold text-sm text-text-primary">
              ResumeForge
            </span>
          </button>
          <span className="text-border-accent">|</span>
          <span className="text-xs text-text-muted font-mono flex items-center gap-1.5">
            <FileText size={12} />
            jane_doe_resume.tex
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-accent-emerald px-2 py-1 rounded-md bg-accent-emerald/10 border border-accent-emerald/20">
            ● Auto-saving
          </span>
        </div>
      </div>

      {/* Main Content — 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Chat Prompt */}
        <div className="w-[380px] flex-shrink-0 border-r border-border-subtle bg-bg-secondary overflow-hidden flex flex-col">
          <ChatPrompt onSendMessage={handlePromptMessage} />
        </div>

        {/* Column 2: PDF Preview */}
        <div className="flex-1 bg-bg-primary overflow-hidden flex flex-col">
          <ResumePreview />
        </div>

        {/* Column 3: Hireability Score Sidebar */}
        <div className="w-[260px] flex-shrink-0 border-l border-border-subtle bg-bg-secondary p-5 overflow-y-auto">
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-1">
              Hireability
            </h3>
            <p className="text-[10px] text-text-muted">
              Score updates live with every AI prompt
            </p>
          </div>
          <HireabilityScore score={score} />

          {/* Missing Keywords */}
          <div className="mt-8">
            <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {["Kubernetes", "GraphQL", "Terraform", "CI/CD"].map((kw) => (
                <span
                  key={kw}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-accent-amber/30 text-accent-amber bg-accent-amber/5 cursor-pointer hover:bg-accent-amber/15 transition-colors"
                >
                  + {kw}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-text-muted mt-2">
              Click a keyword to auto-add it to your resume
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <h4 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Quick Actions
            </h4>
            {[
              "Quantify all bullets",
              "Remove filler words",
              "Add action verbs",
            ].map((action) => (
              <button
                key={action}
                onClick={() => handlePromptMessage(action)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border-subtle text-text-secondary hover:border-accent-rust/40 hover:text-accent-rust hover:bg-accent-rust/5 transition-all"
              >
                ⚡ {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
