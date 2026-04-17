import asyncio

async def transcribe(audio_bytes: bytes) -> str:
    # 1. Save audio_bytes to a temporary file
    # 2. Call Whisper API / local Whisper instance
    # For now, returning a basic mock
    await asyncio.sleep(0.5) # Simulate API latency
    return "This is a mock transcription of the user's speech."
