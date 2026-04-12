const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = 5002;

// Middleware for performance & security
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression()); // Gzip payload compression
app.use(cors({
  origin: [
    'https://ai-resume-builder-dk7b.vercel.app', 
    'http://localhost:3000', 
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Incoming request and response logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
  
  // Override res.json to log the response
  const originalJson = res.json;
  res.json = function (body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] Outgoing Response: ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms - Body:`, JSON.stringify(body));
    return originalJson.call(this, body);
  };
  
  next();
});

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Resume Builder Backend API Running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Avoid connecting to Mongo if URI is not provided yet, but setup the framework
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('MongoDB connection error:', err));
} else {
    console.log('No MONGODB_URI provided in .env yet. Skipping DB connection.');
    mongoose.set('bufferCommands', false); // Prevents infinite hanging
}

// --- Lightweight ATS Fallback ---
const simplifiedAtsAnalysis = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();
  const jd = jobDescription ? jobDescription.toLowerCase() : "";
  
  const sections = {
    experience: /experience|employment|work history/i.test(text),
    education: /education|university|college/i.test(text),
    skills: /skills|technologies|proficiencies/i.test(text),
    projects: /projects|portfolio/i.test(text)
  };

  const sectionScore = Object.values(sections).filter(Boolean).length * 10;
  
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
  const formattingScore = (wordCount >= 300 && wordCount <= 1000) ? 20 : 10;
  
  const totalScore = sectionScore + keywordScore + formattingScore;

  return {
    status: "success",
    isFallback: true,
    score: Math.min(100, totalScore),
    job_match_percentage: jd ? Math.floor((matchedKeywords.length / (matchedKeywords.length + missingKeywords.length || 1)) * 100) : 0,
    matched_keywords: matchedKeywords,
    missing_keywords: missingKeywords,
    suggestions: [
      "Using lightweight analysis (Python parser unavailable).",
      jd ? "" : "Add a job description for better keyword matching.",
      sections.experience ? "" : "Add a clear 'Experience' section.",
      sections.skills ? "" : "Add a clear 'Skills' section."
    ].filter(Boolean)
  };
};

// ATS Analyzer Route
app.post('/api/ats/analyze', async (req, res) => {
  try {
    const { text, job_description } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: "Missing resume text" });
    }

    // Try Python Parser
    // Default to internal Render hostname if possible, then env var, then localhost
    const internalRenderUrl = 'http://resume-parser-service:5001/parse';
    const pythonServiceUrl = process.env.PYTHON_PARSER_URL || internalRenderUrl;
    
    console.log(`Attempting ATS analysis via: ${pythonServiceUrl}`);
    
    try {
      const response = await fetch(pythonServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, job_description }),
        signal: AbortSignal.timeout(5000) // 5s timeout
      });

      if (response.ok) {
        const data = await response.json();
        return res.json({ ...data, isFallback: false });
      }
      console.warn(`Python service returned status ${response.status}. Using Node.js fallback.`);
    } catch (err) {
      console.warn(`Python service unreachable (${err.message}). Using Node.js fallback.`);
    }

    // Fallback to local analysis
    const fallbackData = simplifiedAtsAnalysis(text, job_description);
    return res.json(fallbackData);
    
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    return res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// AI Suggestion Engine — using Groq (free, OpenAI-compatible)
// Get your free API key at: https://console.groq.com
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key',
  baseURL: 'https://api.groq.com/openai/v1'
});

app.post('/api/ai/suggest', async (req, res) => {
  try {
    const { type, text, context } = req.body;
    
    // Fallback if Groq API key is not provided
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === '') {
      console.warn('GROQ_API_KEY missing - returning mock suggestions. Get a free key at https://console.groq.com');
      // Random delay to simulate API
      await new Promise(r => setTimeout(r, 600));
      
      if (type === 'improve_bullet') {
        return res.json({ suggestion: `Spearheaded ${context || 'key'} initiatives, delivering a measurable 25% improvement in team efficiency and achieving all project milestones ahead of schedule.` });
      }
      if (type === 'suggest_skills') {
        const roleSkillMap = {
          frontend: 'TypeScript, GraphQL, Next.js, Cypress, Webpack',
          backend: 'Docker, Kubernetes, Redis, PostgreSQL, gRPC',
          fullstack: 'TypeScript, Docker, GraphQL, Redis, CI/CD',
          data: 'Pandas, TensorFlow, Scikit-learn, SQL, Tableau',
          devops: 'Terraform, Kubernetes, Ansible, Prometheus, Grafana',
          default: 'Docker, Kubernetes, AWS, TypeScript, GraphQL'
        };
        const role = (context || '').toLowerCase();
        const matchedKey = Object.keys(roleSkillMap).find(k => role.includes(k)) || 'default';
        return res.json({ suggestion: roleSkillMap[matchedKey] });
      }
      if (type === 'suggest_keywords') {
        return res.json({ suggestion: "Agile, CI/CD, Microservices, Scalability, TDD" });
      }
      if (type === 'generate_experience') {
        return res.json({ suggestion: `Engineered scalable microservices architecture improving system throughput by 40% and reducing latency by 30%.\nLed a cross-functional team of 5 engineers to deliver project ahead of schedule, saving the company $15k.\nOptimized database queries and introduced caching strategies, cutting monthly cloud infrastructure costs by $10k.`});
      }
      return res.json({ suggestion: "AI Suggestion for " + type });
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === 'improve_bullet') {
      systemPrompt = "You are an expert resume writer. Improve the provided resume bullet point. Make it concise, active, and impactful. Use strong action verbs. Just return the improved bullet point text, nothing else.";
      userPrompt = `Context/Job Title: ${context || 'Unknown'}\nBullet Point to improve: ${text}`;
    } else if (type === 'suggest_skills') {
      systemPrompt = "You are an expert recruiter. Based on the user's job title/role, suggest exactly 5 missing technical or hard skills they might have forgotten. Return a comma-separated list only.";
      userPrompt = `Job Title: ${context}\nCurrent Skills (do not repeat these): ${text}`;
    } else if (type === 'suggest_keywords') {
      systemPrompt = "Suggest 5 critical industry keywords for this resume bullet point or role to improve ATS matching. Comma-separated list only.";
      userPrompt = `Context: ${context}\nContent: ${text}`;
    } else if (type === 'generate_experience') {
      systemPrompt = "You are an expert resume writer. The user provides a Job Title. Generate 3 highly impressive, quantifiable, and action-oriented bullet points that a top-tier candidate in this role would have on their resume. Return only the bullet points separated by newlines, with no bullet symbols like '-' or '*'.";
      userPrompt = `Job Title: ${text}`;
    } else {
      return res.status(400).json({ error: "Invalid suggestion type" });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {"role": "system", "content": systemPrompt},
        {"role": "user", "content": userPrompt}
      ],
      model: "llama3-8b-8192", // Free Groq model — fast & capable
      temperature: 0.7,
      max_tokens: 300
    });

    const suggestion = completion.choices[0].message.content.trim();
    return res.json({ suggestion });

  } catch (error) {
    console.error('AI Suggestion Error:', error.message || error);
    return res.status(500).json({ error: 'Failed to fetch AI suggestion' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
