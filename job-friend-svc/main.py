from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import Optional, Union
from openai import OpenAI
import os
import PyPDF2
import io
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class CoverLetterResponse(BaseModel):
    cover_letter: str

def read_pdf(file: UploadFile) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

@app.post("/generate_cover_letter", response_model=CoverLetterResponse)
async def api_generate_cover_letter(
    job_description: Union[UploadFile, str] = File(...),
    resume: UploadFile = File(...),
    cover_letter_size: str = Form(...),
    formality: float = Form(...),
    additional_params: Optional[str] = Form(None)
):
    try:
        if isinstance(job_description, UploadFile):
            job_description_text = read_pdf(job_description)
        else:
            job_description_text = job_description

        resume_text = read_pdf(resume)

        if cover_letter_size not in ["small", "large"]:
            raise ValueError("cover_letter_size must be 'small' or 'large'")
        
        if not 0 <= formality <= 1:
            raise ValueError("formality must be between 0 and 1")

        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OpenAI API key not found. Please set the 'OPENAI_API_KEY' environment variable.")
        
        client = OpenAI(api_key=api_key)

        params = {
            'cover_letter_size': 180 if cover_letter_size == 'small' else 360,
            'formality': formality
        }
        if additional_params:
            try:
                additional_params_dict = json.loads(additional_params)
                params.update(additional_params_dict)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON in additional_params")

        cover_letter = generate_cover_letter(client, job_description_text, resume_text, params)
        return CoverLetterResponse(cover_letter=cover_letter)
    except Exception as e:
        return JSONResponse(
            status_code=422,
            content={"detail": str(e)}
        )

def generate_cover_letter(client, job_description, resume, params):
    """Generate a cover letter using OpenAI's GPT model."""
    size_instruction = f"at least {params['cover_letter_size']} words"
    formality_instruction = f"a formality level of {params['formality']} on a scale from 0 (very casual) to 1 (very formal)"
    tone_instruction = f"Use a {params.get('tone', 'professional')} tone"
    
    prompt = f"""
You are a professional career advisor and expert cover letter writer. Your task is to write a personalized, compelling, and professional cover letter based on the following information and instructions:

Job Description:
{job_description}

Candidate's Resume:
{resume}

Instructions:
1. The cover letter should be {size_instruction} long.
2. Use {formality_instruction}.
3. {tone_instruction}
4. Highlight the candidate's relevant skills and experiences that align with the job requirements.
5. Be concise, impactful, and tailored to the specific job.
6. Structure the letter with a clear introduction, body, and conclusion.

Now, write the cover letter:
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional cover letter writer who adapts to specific instructions."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,  # Increased to allow for longer responses
            temperature=0.7,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during the API call: {str(e)}")

    cover_letter = response.choices[0].message.content.strip()
    
    # Check if the cover letter meets the minimum word count
    word_count = len(cover_letter.split())
    if word_count < params['cover_letter_size']:
        raise HTTPException(status_code=500, detail=f"Generated cover letter does not meet the minimum word count. Got {word_count} words, expected at least {params['cover_letter_size']} words.")

    return cover_letter

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)