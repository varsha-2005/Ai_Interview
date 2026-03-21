import os
from openai import OpenAI
from typing import List, Dict, Any

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None

def generate_questions(company: str, difficulty: str, role: str, resume_text: str, mode: str) -> Dict[str, Any]:
    if not client:
        return {
            "questions": [
                {"_id": "q1", "question": "Tell me about yourself."},
                {"_id": "q2", "question": "Describe a challenging project you worked on."},
                {"_id": "q3", "question": "How would you optimize a slow database query?"},
            ],
            "note": "OpenAI key missing."
        }

    prompt = f"Generate 5 {difficulty} questions for the {mode} of a {role} interview at {company}. Use the resume info as context:\n{resume_text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500
    )

    output = response.choices[0].message.content or ""
    questions = [
        {"_id": f"q{idx+1}", "question": line.strip().lstrip("0123456789. ")}
        for idx, line in enumerate(output.split('\n')[:5]) if line.strip()
    ]
    return {"questions": questions}

def screen_resume(resume_text: str, job_description: str, company: str) -> Dict[str, Any]:
    if not client:
        return {"score": 75, "feedback": "OpenAI key missing."}

    prompt = f"You are an AI resume screener for {company}. Compare the candidate resume text to the job description and provide:\n1) A match score 0-100;\n2) Three bullet feedback points.\n\nResume text:\n{resume_text}\n\nJob description:\n{job_description}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )

    output = response.choices[0].message.content or "No feedback."
    import re
    match = re.search(r'\d+', output)
    score = int(match.group()) if match else 70
    return {"score": score, "feedback": output}

def create_embedding(text: str) -> List[float]:
    if not client or not text:
        return []
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Embedding failed: {e}")
        return []

def evaluate_answer(question: str, answer: str) -> Dict[str, Any]:
    if not client:
        return {"score": 3, "evaluation": "No OpenAI key set."}

    prompt = f"You are an interviewer evaluating a candidate answer.\nQuestion: {question}\nCandidate answer: {answer}\n\nScore out of 5 and feedback."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )

    output = response.choices[0].message.content or ""
    import re
    match = re.search(r'(\d)\s*/\s*5|Score:\s*(\d)', output, re.I)
    score = int(match.group(1) or match.group(2)) if match else 3
    return {"score": score, "evaluation": output}