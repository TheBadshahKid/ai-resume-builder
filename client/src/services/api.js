export const suggestImprovement = async (type, text, context) => {
  try {
    const response = await fetch('/api/ai/suggest', {
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

export const analyzeResumeATS = async (text, job_description) => {
  try {
    const response = await fetch('/api/ats/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, job_description })
    });
    
    if (!response.ok) throw new Error('API Request Failed');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ATS Analysis Error:', error);
    return null;
  }
};
