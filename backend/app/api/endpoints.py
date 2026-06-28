from fastapi import APIRouter, UploadFile, File,Body, BackgroundTasks, Depends, Form
from pydantic import BaseModel
import os
import shutil
import subprocess
import uuid
import json
import datetime
from groq import Groq
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from app.core.database import get_db
from app.api.auth import get_current_user
from app.services import stt_service, llm_service, tts_service, feedback_generator
from app.api.texttosp import text_to_speech

load_dotenv()
router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
db = get_db()

# Configure Cloudinary
cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

def upload_to_cloudinary(file_path: str) -> str:
    try:
        if not os.getenv("CLOUDINARY_CLOUD_NAME") or not os.getenv("CLOUDINARY_API_KEY") or not os.getenv("CLOUDINARY_API_SECRET"):
            print("WARNING: Cloudinary credentials not configured in environment variables. Local fallback active.")
            return ""
        
        upload_result = cloudinary.uploader.upload(
            file_path,
            resource_type="video",  # Audio files are treated as video resource type in Cloudinary
            folder="english_speak_recordings"
        )
        return upload_result.get("secure_url", "")
    except Exception as e:
        print(f"ERROR: Cloudinary upload failed: {e}")
        return ""

class StartSessionReq(BaseModel):
    user_id: str
    mode: str
    topic: str
    level: str

UPLOAD_DIR="uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    filename = str(uuid.uuid4())
    input_path=os.path.join(UPLOAD_DIR,f"{filename}.webm")
    output_path=os.path.join(UPLOAD_DIR,f"{filename}.mp3")
        # Save uploaded file
    content = await file.read()
    with open(input_path, "wb") as f:
        f.write(content)

    # Convert to mp3 using ffmpeg
    subprocess.run([
        "ffmpeg", "-y","-i", input_path,"-af", "highpass=f=200,lowpass=f=3000,afftdn", output_path
    ])
    if os.path.exists(input_path):
        os.remove(input_path)
    
    with open(output_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            temperature=0,
            response_format="verbose_json"
        )

    text = transcription.text

        # 🤖 AI FEEDBACK (IMPORTANT FIX)
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": f"""
You are a warm, encouraging English speaking coach helping learners build confidence.

Analyze the student's spoken response below and return ONLY a valid JSON object — no markdown, no explanation, nothing else.

Student's response:
"{text}"

SCORING RULES (be lenient and motivating):
- A response with mostly correct grammar and clear meaning = 80-90 for grammar
- Minor mistakes (missing article, wrong plural) = 70-80, NOT below 70
- Good natural flow with minor pauses = 75-85 for fluency
- Common everyday vocabulary used correctly = 75-85 for vocab
- If the sentence is understandable = pronunciation minimum 78

- At least 3 out of 4 scores must be 70 or above if the student speaks a full meaningful sentence
- Total = average of the four scores, rounded to nearest integer
- Reward effort: if the student tried to speak in full sentences, scores should reflect that positively

MESSAGE RULES:
- "grammar" message: show ONE specific correction in this format only: wrong phrase → correct phrase (e.g. "jobs of opportunity → job opportunities"). If no mistakes, write "Perfect grammar, well done!"
- "fluency" message: one short encouraging line, max 10 words
- "vocabulary" message: suggest ONE upgrade in this format only: simple word → better word (e.g. "good → excellent"). If vocab is already good, write "Great word choices!"
- "vocabulary" message: suggest ONE upgrade in this format: simpleword → better word (e.g. "good → excellent"). If vocab is fine, write "Great word choices!"  
- "pronunciation" message: one short encouraging line, max 10 words
- "total" message: one warm overall summary, max 12 words

Return exactly this JSON structure:
{{
  "scores": {{
    "grammar": <integer 0-100>,
    "fluency": <integer 0-100>,
    "vocabulary": <integer 0-100>,
    "pronunciation": <integer 0-100>,
    "total": <integer, average of the four>
  }},
  "messages": {{
    "grammar": "<wrong phrase → correct phrase, or 'Perfect grammar, well done!'>",
    "fluency": "<one short encouraging sentence>",
    "vocabulary": "<simple word → better word, or 'Great word choices!'>",
    "pronunciation": "<one short encouraging sentence>",
    "total": "<one warm summary sentence>"
  }},
  "improved": "<rewrite the student's full answer in natural, fluent English — same meaning, better phrasing>",
  "tips": [
    "<tip 1: specific and actionable, based on actual mistake in their speech>",
    "<tip 2: specific and actionable>",
    "<tip 3: encouraging, about what they did well or how to improve further>"
  ]
}}

IMPORTANT: Return ONLY the raw JSON. No backticks, no explanation, no extra text.
"""
            }
        ],
        temperature=0.7
    )

    feedback_json = json.loads(completion.choices[0].message.content)

    # Cloudinary Upload
    cloudinary_url = upload_to_cloudinary(output_path)

    # Database Store
    recording_data = {
        "user_id": current_user["id"],
        "user_email": current_user["email"],
        "transcript": text,
        "cloudinary_url": cloudinary_url,
        "feedback": feedback_json,
        "type": "behavioral",
        "created_at": datetime.datetime.utcnow()
    }
    db["recordings"].insert_one(recording_data)

    return {
        "message": "Converted + Transcribed ✅",
        "transcript": text,
        "feedback": feedback_json,
        "mp3_url": cloudinary_url or f"uploads/{filename}.mp3"
    }
sessions = {}

SYSTEM_PROMPT = """
You are Mira, a friendly AI English speaking coach.

- Start conversation warmly.
- Ask what software development topic the user wants to practice speaking about.
- Keep replies short (2-3 lines).
- Encourage speaking and communication.
- Be polite and motivating.
- STRICT RULE: You are ONLY allowed to discuss English speaking practice and software development / programming / engineering tasks. If the user asks about or tries to discuss any other topic (such as general knowledge, history, recipes, entertainment, etc.), politely decline and steer the conversation back to English speaking and software development topics.
"""

# 🚀 START API (optional but clean)
@router.get("/start")
def start_chat(current_user: dict = Depends(get_current_user)):
    session_id = str(uuid.uuid4())

    sessions[session_id] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    first_message = "Hi! I'm Mira 👋 What software development topic would you like guidance or practice on today?"
    audio_path=text_to_speech(first_message,session_id)
    sessions[session_id].append({
        "role": "assistant",
        "content": first_message
    })

    return {
        "session_id": session_id,
        "reply": first_message,
        "audio_url": f"http://127.0.0.1:8000/{audio_path}"
    }


# 🚀 MAIN CHAT API
@router.post("/chat")
def chat(
    session_id: str = Body(...),
    message: str = Body(...),
    current_user: dict = Depends(get_current_user)
):

    # 🆕 create session if not exists
    if session_id not in sessions:
        sessions[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

    # ➕ add user message
    sessions[session_id].append({
        "role": "user",
        "content": message
    })

    # 🧠 AI response
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=sessions[session_id],
        temperature=0.7
    )

    ai_reply = completion.choices[0].message.content
    audio_path=text_to_speech(ai_reply,session_id)
    audio_url = f"http://127.0.0.1:8000/{audio_path}"
    # ➕ store AI reply
    sessions[session_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    # ⚠️ limit history (important for performance)
    sessions[session_id] = sessions[session_id][-10:]

    return {
        "reply": ai_reply,
        "audio_url": audio_url, 
        "history": sessions[session_id]
    }


# 🎤 UPLOAD CHAT AUDIO API
@router.post("/upload-chat")
async def upload_chat(
    file: UploadFile = File(...),
    session_id: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    filename = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{filename}.webm")
    output_path = os.path.join(UPLOAD_DIR, f"{filename}.mp3")
    
    # Save uploaded file
    content = await file.read()
    with open(input_path, "wb") as f:
        f.write(content)

    # Convert to mp3 using ffmpeg
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path, "-af", "highpass=f=200,lowpass=f=3000,afftdn", output_path
    ])
    if os.path.exists(input_path):
        os.remove(input_path)
    
    with open(output_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            temperature=0,
            response_format="verbose_json"
        )

    text = transcription.text

    # Maintain session chat history
    if session_id not in sessions:
        sessions[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]

    # Add transcribed text to history
    sessions[session_id].append({
        "role": "user",
        "content": text
    })

    # Query LLM
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=sessions[session_id],
        temperature=0.7
    )

    ai_reply = completion.choices[0].message.content
    audio_path = text_to_speech(ai_reply, session_id)
    audio_url = f"http://127.0.0.1:8000/{audio_path}"
    
    # Append reply to session history
    sessions[session_id].append({
        "role": "assistant",
        "content": ai_reply
    })

    # Limit history length
    sessions[session_id] = sessions[session_id][-10:]

    # Cloudinary Upload
    cloudinary_url = upload_to_cloudinary(output_path)

    # Database Store
    recording_data = {
        "user_id": current_user["id"],
        "user_email": current_user["email"],
        "transcript": text,
        "cloudinary_url": cloudinary_url,
        "type": "chat",
        "created_at": datetime.datetime.utcnow()
    }
    db["recordings"].insert_one(recording_data)

    return {
        "transcript": text,
        "reply": ai_reply,
        "audio_url": audio_url
    }


# 🎤 UPLOAD TECHNICAL AUDIO API
@router.post("/upload-technical")
async def upload_technical(
    file: UploadFile = File(...),
    question: str = Form(...),
    current_user: dict = Depends(get_current_user)
):
    filename = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{filename}.webm")
    output_path = os.path.join(UPLOAD_DIR, f"{filename}.mp3")
    
    # Save uploaded file
    content = await file.read()
    with open(input_path, "wb") as f:
        f.write(content)

    # Convert to mp3 using ffmpeg
    subprocess.run([
        "ffmpeg", "-y", "-i", input_path, "-af", "highpass=f=200,lowpass=f=3000,afftdn", output_path
    ])
    if os.path.exists(input_path):
        os.remove(input_path)
    
    with open(output_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3-turbo",
            temperature=0,
            response_format="verbose_json"
        )

    text = transcription.text

    # 🤖 AI FEEDBACK FOR TECHNICAL ACCURACY
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": f"""
You are an expert technical interviewer assessing a backend software engineer's response to an interview question.

Software Engineering Question: "{question}"
Candidate's Spoken Response: "{text}"

Analyze the candidate's response for technical correctness, precision, and accuracy. Return ONLY a valid JSON object — no markdown, no explanation, nothing else.

EVALUATION RULES:
- Rate the response's technical correctness on a scale of 0 to 100.
- Be objective but constructive. If the response explains the core concept correctly, give it a high score (80-90+). If there are major misunderstandings or incorrect statements, reflect that in the score.
- Identify specific technical key points they successfully covered.
- Identify key concepts they should have included to make their answer complete, or any errors they made.

Return exactly this JSON structure:
{{
  "score": <integer 0-100>,
  "feedback_summary": "<a concise 2-3 sentence overall technical assessment of their answer>",
  "key_points_covered": [
    "<point 1 they explained correctly>",
    "<point 2 they explained correctly>"
  ],
  "missing_concepts": [
    "<missing concept 1 or correction 1>",
    "<missing concept 2 or correction 2>"
  ],
  "improved": "<A pristine, industry-standard model answer explaining the topic in 3-4 clear, professional sentences>"
}}
"""
            }
        ],
        temperature=0.3
    )

    feedback_json = json.loads(completion.choices[0].message.content)

    # Cloudinary Upload
    cloudinary_url = upload_to_cloudinary(output_path)

    # Database Store
    recording_data = {
        "user_id": current_user["id"],
        "user_email": current_user["email"],
        "question": question,
        "transcript": text,
        "cloudinary_url": cloudinary_url,
        "feedback": feedback_json,
        "type": "technical",
        "created_at": datetime.datetime.utcnow()
    }
    db["recordings"].insert_one(recording_data)

    return {
        "transcript": text,
        "feedback": feedback_json,
        "mp3_url": cloudinary_url or f"uploads/{filename}.mp3"
    }