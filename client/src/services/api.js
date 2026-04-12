const localAiMock = (type, context) => {
  const jobTitle = (context || 'Developer').toLowerCase();
  
  if (type === 'suggest_skills') {
    const roleSkillMap = {
      frontend: 'React, TypeScript, Next.js, Tailwind CSS, GraphQL',
      backend: 'Node.js, Python, PostgreSQL, Docker, Redis',
      fullstack: 'TypeScript, React, Node.js, Docker, AWS',
      data: 'Python, Pandas, SQL, TensorFlow, Airflow',
      devops: 'Kubernetes, Terraform, AWS, CI/CD, Prometheus',
      default: 'JavaScript, Git, Agile, REST APIs, Problem Solving'
    };
    const matchedKey = Object.keys(roleSkillMap).find(k => jobTitle.includes(k)) || 'default';
    return roleSkillMap[matchedKey];
  }
  
  if (type === 'improve_bullet') {
    return 'Improved bullet point (Offline Mode): Reduced overhead by 15% through implementing scalable architecture solutions, ensuring 99.9% uptime.';
  }
  
  if (type === 'generate_experience') {
    return '• Spearheaded the development of core application features resulting in 20% increased user retention.\n• Collaborated with cross-functional teams to integrate RESTful APIs seamlessly.\n• Optimized database queries, cutting response time by an average of 40%.';
  }
  
  return null;
};

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
    
    // Check if the backend API failed or if Vercel returned the index.html fallback
    const contentType = response.headers.get("content-type");
    if (!response.ok || (contentType && contentType.includes("text/html"))) {
      console.warn("Backend API unreachable or not configured. Using offline AI mock.");
      return localAiMock(type, context);
    }
    
    const data = await response.json();
    return data.suggestion;
  } catch (error) {
    console.warn('Network error or AI API Offline:', error.message);
    return localAiMock(type, context);
  }
};

// Expanded keyword list for much better local fallback analysis
const TECH_KEYWORDS = [
  // Frontend
  "javascript", "typescript", "react", "vue", "angular", "next", "svelte", "html", "css", "sass",
  "webpack", "vite", "graphql", "redux", "tailwind", "cypress", "jest", "figma",
  // Backend
  "node", "python", "java", "golang", "rust", "php", "ruby", "express", "fastapi", "django",
  "spring", "laravel", "flask", "grpc", "rest", "api",
  // Database
  "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "sqlite",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "github",
  "gitlab", "ci", "cd", "linux", "nginx", "prometheus", "grafana",
  // Practices & Soft
  "agile", "scrum", "git", "tdd", "microservices", "serverless", "devops", "datadog",
  // Data / AI
  "pandas", "numpy", "tensorflow", "pytorch", "scikit", "spark", "airflow", "kafka", "tableau"
];

// Simple cosine-like similarity using word overlap
const computeMatchScore = (text1, text2) => {
  const words1 = new Set(text1.toLowerCase().match(/\b\w{3,}\b/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/\b\w{3,}\b/g) || []);
  if (words1.size === 0 || words2.size === 0) return 0;
  const intersection = [...words1].filter(w => words2.has(w));
  // Jaccard similarity
  const union = new Set([...words1, ...words2]);
  return Math.round((intersection.length / union.size) * 100);
};

const localAtsAnalysis = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();
  const jd = jobDescription ? jobDescription.toLowerCase() : "";
  
  const sections = {
    experience: /experience|employment|work history/i.test(text),
    education: /education|university|college|degree/i.test(text),
    skills: /skills|technologies|proficiencies|tools/i.test(text),
    projects: /projects|portfolio|built|developed/i.test(text)
  };

  const sectionScore = Object.values(sections).filter(Boolean).length * 15;
  
  let keywordScore = 20;
  let matchedKeywords = [];
  let missingKeywords = [];
  let job_match_percentage = null; // null = no JD provided

  if (jd) {
    // Extract JD words and cross-reference with the expanded keyword list
    const jdWords = new Set(jd.match(/\b\w{3,}\b/g) || []);
    const resumeWords = new Set(text.match(/\b\w{3,}\b/g) || []);
    
    const targetKeywords = TECH_KEYWORDS.filter(k => jdWords.has(k));
    matchedKeywords = targetKeywords.filter(k => resumeWords.has(k));
    missingKeywords = targetKeywords.filter(k => !resumeWords.has(k));
    
    if (targetKeywords.length > 0) {
      keywordScore = Math.floor((matchedKeywords.length / targetKeywords.length) * 40);
    } else {
      // No recognised keywords in JD, use word-level similarity for score
      keywordScore = 25;
    }
    
    // Use cosine-like similarity for job match %
    job_match_percentage = computeMatchScore(resumeText, jobDescription);
  }

  const wordCount = resumeText.split(/\s+/).length;
  const formattingScore = (wordCount >= 200 && wordCount <= 1200) ? 25 : 10;
  
  const totalScore = sectionScore + keywordScore + formattingScore;

  const suggestions = [
    "Running in Offline Mode (Server unreachable).",
    jd ? null : "Add a job description for targeted keyword matching.",
    sections.experience ? null : "Your resume is missing a clear 'Experience' section.",
    sections.skills ? null : "Don't forget to list your technical skills.",
    job_match_percentage !== null && job_match_percentage < 35
      ? "Low job match. Incorporate more keywords from the job description into your resume."
      : null,
    !sections.projects ? "Adding a Projects section can significantly boost your ATS score." : null
  ].filter(Boolean);

  return {
    status: "success",
    score: Math.min(100, Math.max(25, totalScore)),
    job_match_percentage,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    suggestions,
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
