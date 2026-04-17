from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Depends, Form
from pydantic import BaseModel
import uuid
from app.services import stt_service, llm_service, tts_service, feedback_generator

router = APIRouter()

class StartSessionReq(BaseModel):
    user_id: str
    mode: str
    topic: str
    level: str

@router.post("/sessions/start")
async def start_session(req: StartSessionReq):
    session_id = str(uuid.uuid4())
    # Database logic to create session goes here
    
    welcome_text = f"Welcome! Let's talk about {req.topic}."
    welcome_audio_url = await tts_service.synthesize(welcome_text)
    
    return {
        "session_id": session_id,
        "welcome_message": welcome_text,
        "welcome_audio_url": welcome_audio_url
    }

@router.post("/sessions/{session_id}/message")
async def process_message(
    session_id: str, 
    background_tasks: BackgroundTasks, 
    audio_file: UploadFile = File(...)
):
    # 1. Speech to Text
    file_bytes = await audio_file.read()
    user_text = await stt_service.transcribe(file_bytes)
    
    # 2. LLM Respond
    ai_response = await llm_service.generate_reply(session_id, user_text)
    
    # 3. Text to Speech
    audio_stream_url = await tts_service.synthesize(ai_response)
    
    # 4. Trigger background evaluation
    background_tasks.add_task(feedback_generator.analyze_turn, session_id, user_text)
    
    return {
        "user_text": user_text,
        "ai_response": ai_response,
        "audio_url": audio_stream_url,
        "mistakes_found": False # dynamically updated async usually
    }

@router.post("/sessions/{session_id}/end")
async def end_session(session_id: str):
    return {"status": "ended", "message": "Feedback report generating in background."}

@router.get("/reports/{session_id}")
async def get_report(session_id: str):
    return {
        "session_id": session_id,
        "overall_score": 85,
        "summary": "Good effort overall, watch your past tense verbs.",
        "grammar_mistakes": [
            {
                "original": "I go to store yesterday.",
                "corrected": "I went to the store yesterday.",
                "explanation": "Use 'went' instead of 'go' for past events."
            }
        ]
    }
