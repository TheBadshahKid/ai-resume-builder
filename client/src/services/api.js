export const suggestImprovement = async (type, text, context) => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  try {
    const response = await fetch(`${baseUrl}/api/ai/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, text, context })
    });
    
    if (!response.ok) throw new Error('API Request Failed');
    
    const data = await response.json();
    return data.suggestion;
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return null;
  }
};

const localAtsAnalysis = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();
  const jd = jobDescription ? jobDescription.toLowerCase() : "";
  
  const sections = {
    experience: /experience|employment|work history/i.test(text),
    education: /education|university|college/i.test(text),
    skills: /skills|technologies|proficiencies/i.test(text),
    projects: /projects|portfolio/i.test(text)
  };

  const sectionScore = Object.values(sections).filter(Boolean).length * 15;
  
  let keywordScore = 20;
  let matchedKeywords = [];
  let missingKeywords = [];

  if (jd) {
    const commonKeywords = ["javascript", "react", "node", "python", "sql", "aws", "docker", "agile", "git", "typescript", "graphql"];
    const jdWords = jd.split(/\W+/);
    const resumeWords = text.split(/\W+/);
    
    const targetKeywords = commonKeywords.filter(k => jdWords.includes(k));
    matchedKeywords = targetKeywords.filter(k => resumeWords.includes(k));
    missingKeywords = targetKeywords.filter(k => !resumeWords.includes(k));
    
    if (targetKeywords.length > 0) {
      keywordScore = Math.floor((matchedKeywords.length / targetKeywords.length) * 40);
    }
  }

  const wordCount = resumeText.split(/\s+/).length;
  const formattingScore = (wordCount >= 200 && wordCount <= 1200) ? 25 : 10;
  
  const totalScore = sectionScore + keywordScore + formattingScore;

  return {
    status: "success",
    score: Math.min(100, Math.max(25, totalScore)),
    job_match_percentage: jd ? Math.floor((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length || 1)) * 100) : 0,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    suggestions: [
      "Running in Offline Mode (Server unreachable).",
      jd ? "" : "Add a job description for keyword matching.",
      sections.experience ? "" : "Your resume is missing a clear 'Experience' section.",
      sections.skills ? "" : "Don't forget to list your technical skills."
    ].filter(Boolean),
    isFallback: true
  };
};

export const analyzeResumeATS = async (text, job_description) => {
  const baseUrl = import.meta.env.VITE_API_URL || '';
  try {
    const response = await fetch(`${baseUrl}/api/ats/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, job_description })
    });
    
    if (!response.ok) {
      console.warn('Backend API failed, using client-side fallback.');
      return localAtsAnalysis(text, job_description);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Network error or Backend unreachable, using client-side fallback:', error.message);
    return localAtsAnalysis(text, job_description);
  }
};
