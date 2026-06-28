from gtts import gTTS
import os

def text_to_speech(text, filename):
    """
    Converts text to speech using gTTS and saves it to a file.
    """
    os.makedirs("uploads/audio", exist_ok=True)
    output_path = f"uploads/audio/{filename}.mp3"
    
    try:
        # Create gTTS object
        tts = gTTS(text=text, lang='en')
        
        # Save the audio file
        tts.save(output_path)
        
        print(f"✅ Audio saved to {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ Error in gTTS: {e}")
        return None