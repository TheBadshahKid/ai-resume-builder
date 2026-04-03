"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  Zap,
  FileText,
  Palette,
  Target,
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  action?: string;
};

const SUGGESTION_CHIPS = [
  { label: "Rewrite with STAR method", icon: <Zap size={14} />, prompt: "Rewrite my latest experience bullet using the STAR method with quantified results" },
  { label: "Improve ATS score", icon: <Target size={14} />, prompt: "Analyze my resume against the job description and suggest missing keywords" },
  { label: "Change to modern theme", icon: <Palette size={14} />, prompt: "Switch to a modern, clean theme with more whitespace and a sans-serif font" },
  { label: "Add a project section", icon: <FileText size={14} />, prompt: "Add a new Projects section with a placeholder project entry" },
];

export default function ChatPrompt({
  onSendMessage,
}: {
  onSendMessage: (msg: string) => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hey! I'm your AI resume architect. Tell me what you'd like to do — rewrite bullets, change themes, or optimize for ATS. I'll handle the LaTeX for you. ✨",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const simulateAIResponse = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    if (lower.includes("star") || lower.includes("rewrite")) {
      return "Done! I've rewritten your bullet points using the STAR framework. Each point now includes a quantified result. Check the preview →";
    }
    if (lower.includes("ats") || lower.includes("keyword") || lower.includes("score")) {
      return "I've analyzed your resume against the job description. Your ATS score jumped from 62 to 87! I added 4 missing keywords: Docker, CI/CD, GraphQL, and Terraform. 🎯";
    }
    if (lower.includes("theme") || lower.includes("font") || lower.includes("layout") || lower.includes("modern")) {
      return 'Theme updated! Switched to "Nordic Frost" — clean sans-serif typography with increased line spacing. The PDF preview is refreshing now. 🎨';
    }
    if (lower.includes("project")) {
      return "Added a new Projects section with a placeholder. Click the preview to edit inline, or tell me about your project and I'll fill it in! 📁";
    }
    return "Got it! I've made the changes to your resume. The LaTeX is compiling now — check the live preview on the right for the updated PDF. ⚡";
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    onSendMessage(trimmed);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: simulateAIResponse(trimmed),
        timestamp: new Date(),
        action: "applied",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-rust/20 flex items-center justify-center">
            <Bot size={18} className="text-accent-rust" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              ResumeForge AI
            </h2>
            <p className="text-xs text-text-muted">
              Prompt-driven LaTeX builder
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                msg.role === "ai"
                  ? "bg-accent-rust/20"
                  : "bg-accent-violet/20"
              }`}
            >
              {msg.role === "ai" ? (
                <Sparkles size={14} className="text-accent-rust" />
              ) : (
                <User size={14} className="text-accent-violet" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "ai"
                  ? "bg-bg-tertiary text-text-primary rounded-tl-md"
                  : "bg-accent-rust/15 text-text-primary rounded-tr-md"
              }`}
            >
              {msg.content}
              {msg.action && (
                <span className="block mt-2 text-[10px] text-accent-emerald font-mono uppercase tracking-wider">
                  ✓ Changes applied to LaTeX
                </span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent-rust/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-accent-rust" />
            </div>
            <div className="bg-bg-tertiary rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
              <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
              <div className="w-2 h-2 rounded-full bg-text-muted typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="flex-shrink-0 px-5 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setInput(chip.prompt);
                inputRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-subtle bg-bg-tertiary text-text-secondary text-xs whitespace-nowrap hover:border-accent-rust hover:text-accent-rust transition-all duration-200 hover:bg-accent-rust/5"
            >
              {chip.icon}
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-5 pb-5">
        <div className="relative flex items-end gap-2 bg-bg-tertiary border border-border-subtle rounded-2xl px-4 py-3 focus-within:border-accent-rust/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what to change..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none resize-none max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl bg-accent-rust text-white flex items-center justify-center hover:bg-accent-rust-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
