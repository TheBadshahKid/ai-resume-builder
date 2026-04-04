from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import json
import math
import os

app = Flask(__name__)
CORS(app)

# Attempt to load spacy model, fallback to basic text processing if not available
try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except (ImportError, OSError):
    print("Warning: spacy module or model 'en_core_web_sm' not found. Using simple keyword extraction fallback.")
    nlp = None

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Parser Service is running", "version": "1.0"})

def extract_keywords(text):
    if nlp is not None:
        doc = nlp(text.lower())
        # Extract nouns, proper nouns, and recognized entities
        keywords = set([token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop])
        return keywords
    else:
        # Simple fallback
        words = re.findall(r'\b\w+\b', text.lower())
        return set([w for w in words if len(w) > 3])

def compute_cosine_similarity(text1, text2):
    # Extremely lightweight TF-IDF approximation using Term Frequency
    words1 = [w for w in re.findall(r'\b\w+\b', text1.lower()) if len(w) > 3]
    words2 = [w for w in re.findall(r'\b\w+\b', text2.lower()) if len(w) > 3]
    
    unique_words = set(words1).union(set(words2))
    
    vec1 = [words1.count(w) for w in unique_words]
    vec2 = [words2.count(w) for w in unique_words]
    
    dot_product = sum(v1 * v2 for v1, v2 in zip(vec1, vec2))
    mag1 = math.sqrt(sum(v ** 2 for v in vec1))
    mag2 = math.sqrt(sum(v ** 2 for v in vec2))
    
    if mag1 == 0 or mag2 == 0:
        return 0.0
    
    return dot_product / (mag1 * mag2)

@app.route('/parse', methods=['POST'])
def parse_resume():
    try:
        data = request.json
        resume_text = data.get('text', '')
        job_description = data.get('job_description', '')
        
        if not resume_text:
             return jsonify({"error": "No resume text provided"}), 400

        resume_keywords = extract_keywords(resume_text)
        
        score_breakdown = {
            "keyword_match": 0,
            "section_completeness": 0,
            "formatting": 0
        }
        
        missing_keywords = []
        matched_keywords = []
        suggestions = []
        weak_sections = []
        job_match_percentage = 0
        
        # 1. Keyword density / Match & Job Match Engine (40% of score)
        if job_description:
            jd_keywords = extract_keywords(job_description)
            missing_set = jd_keywords - resume_keywords
            matched_set = jd_keywords.intersection(resume_keywords)
            
            missing_keywords = list(missing_set)
            matched_keywords = list(matched_set)
            
            # Use Cosine Similarity for the advanced semantic job match
            similarity_score = compute_cosine_similarity(resume_text, job_description)
            job_match_percentage = int(similarity_score * 100)
            
            if len(jd_keywords) > 0:
                match_ratio = len(matched_set) / len(jd_keywords)
                # Combine similarity and pure keyword ratio
                blended_match = (match_ratio + similarity_score) / 2
                score_breakdown["keyword_match"] = min(40, int(blended_match * 40 * 1.5))
            else:
                score_breakdown["keyword_match"] = 30
                
            if job_match_percentage < 40:
                suggestions.append(f"Job Match is low ({job_match_percentage}%). Tailor your resume closer to the JD using the missing keywords.")
            else:
                suggestions.append(f"Strong structural similarity to the job description ({job_match_percentage}% match).")
        else:
            # If no JD, give a generous base score but suggest adding a JD
            score_breakdown["keyword_match"] = 30
            suggestions.append("Add a Target Job Description to see specific missing keywords.")
            # Dummy missing tech keywords
            common_tech_keywords = {"javascript", "python", "react", "node", "sql", "aws", "agile", "git"}
            missing_keywords = list(common_tech_keywords - resume_keywords)[:5]
            if missing_keywords:
               suggestions.append(f"Consider adding common industry keywords if applicable: {', '.join(missing_keywords)}")
               
        # 2. Section Completeness (40% of score)
        # Check if text contains common section headers
        text_lower = resume_text.lower()
        sections_found = {
            "experience": "experience" in text_lower or "employment" in text_lower,
            "education": "education" in text_lower or "university" in text_lower,
            "skills": "skills" in text_lower or "technologies" in text_lower,
            "projects": "projects" in text_lower
        }
        
        completeness_pts = sum([10 if found else 0 for found in sections_found.values()])
        score_breakdown["section_completeness"] = completeness_pts
        
        for sec, found in sections_found.items():
            if not found:
                weak_sections.append(sec.capitalize())
                suggestions.append(f"Your resume seems to be missing a clear '{sec.capitalize()}' section.")
                
        # 3. Formatting Rules / Impact (20% of score)
        formatting_pts = 0
        # Check length (ideally between 300 and 1500 words)
        word_count = len(resume_text.split())
        if 300 <= word_count <= 1000:
            formatting_pts += 10
        elif word_count > 1000:
            formatting_pts += 5
            suggestions.append("Resume is quite long. Consider keeping it concise (under 1000 words).")
        else:
            suggestions.append("Resume is quite short. Add more detail to your experience and projects.")
            
        # Check for numbers/metrics (%)
        if re.search(r'\d+%|\$\d+|\d+x', text_lower):
            formatting_pts += 10
        else:
            suggestions.append("Include quantifiable metrics (e.g., %, $, 10x) to show impact in your experience.")
            
        score_breakdown["formatting"] = formatting_pts
        
        total_score = sum(score_breakdown.values())
        
        # Ensure score is within 0-100
        total_score = max(0, min(100, total_score))

        return jsonify({
            "status": "success",
            "score": total_score,
            "job_match_percentage": job_match_percentage,
            "breakdown": score_breakdown,
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "weak_sections": weak_sections,
            "suggestions": suggestions,
            "word_count": word_count
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
