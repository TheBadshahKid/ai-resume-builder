"use client";

import { useState, useEffect } from "react";
import { Trophy, TrendingUp, AlertTriangle, ChevronUp, Star } from "lucide-react";

type ScoreTier = {
  label: string;
  color: string;
  emoji: string;
  min: number;
};

const TIERS: ScoreTier[] = [
  { label: "Needs Work", color: "var(--accent-red)", emoji: "🔴", min: 0 },
  { label: "Getting There", color: "var(--accent-amber)", emoji: "🟡", min: 40 },
  { label: "Competitive", color: "var(--accent-emerald)", emoji: "🟢", min: 70 },
  { label: "Highly Hireable", color: "var(--accent-violet)", emoji: "🏆", min: 90 },
];

function getTier(score: number): ScoreTier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].min) return TIERS[i];
  }
  return TIERS[0];
}

export default function HireabilityScore({ 
  score: targetScore,
  resumeText = "Senior Software Engineer with experience in React and Node.js",
  jobDescription = "Senior React Developer with experience in AWS and Kubernetes"
}: { 
  score: number;
  resumeText?: string;
  jobDescription?: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(targetScore);
  const [prevScore, setPrevScore] = useState(0);
  const tier = getTier(animatedScore);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const fetchATSScore = async () => {
      // Use the Node server as a proxy to avoid direct Python CORS issues
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";
      try {
        const res = await fetch(`${apiUrl}/api/ats/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: resumeText, job_description: jobDescription }),
        });
        if (res.ok) {
          const data = await res.json();
          setDisplayScore(data.score || targetScore);
        }
      } catch (e) {
        console.warn("Backend API not reached, using targetScore fallback");
        setDisplayScore(targetScore);
      }
    };
    fetchATSScore();
  }, [targetScore, resumeText, jobDescription]);

  useEffect(() => {
    setPrevScore(animatedScore);
    const duration = 1200;
    const startTime = Date.now();
    const startVal = animatedScore;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (displayScore - startVal) * eased);
      setAnimatedScore(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [displayScore]);

  const delta = targetScore - prevScore;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular Score */}
      <div className="relative animate-score-glow">
        <svg width="148" height="148" viewBox="0 0 148 148">
          {/* Background track */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 74 74)"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold tabular-nums" style={{ color: tier.color }}>
            {animatedScore}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Tier Badge */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full border"
        style={{ borderColor: tier.color, backgroundColor: `${tier.color}15` }}
      >
        <Trophy size={14} style={{ color: tier.color }} />
        <span className="text-xs font-semibold" style={{ color: tier.color }}>
          {tier.emoji} {tier.label}
        </span>
      </div>

      {/* Delta indicator */}
      {delta !== 0 && (
        <div className={`flex items-center gap-1 text-xs font-mono ${delta > 0 ? 'text-accent-emerald' : 'text-accent-red'}`}>
          {delta > 0 ? <ChevronUp size={14} /> : <AlertTriangle size={12} />}
          {delta > 0 ? `+${delta}` : delta} since last prompt
        </div>
      )}

      {/* Mini breakdown */}
      <div className="w-full space-y-2.5 mt-2">
        {[
          { label: "Keywords", value: Math.min(100, animatedScore + 8), icon: <Star size={12} /> },
          { label: "Structure", value: Math.min(100, animatedScore - 3), icon: <TrendingUp size={12} /> },
          { label: "Impact", value: Math.min(100, animatedScore + 2), icon: <Trophy size={12} /> },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-text-muted">{item.icon}</span>
            <span className="text-[11px] text-text-secondary w-16">{item.label}</span>
            <div className="flex-1 h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.max(0, item.value)}%`,
                  backgroundColor: getTier(item.value).color,
                }}
              />
            </div>
            <span className="text-[11px] font-mono text-text-muted w-8 text-right tabular-nums">
              {Math.max(0, item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
