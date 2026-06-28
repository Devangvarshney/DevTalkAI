import { useState, useRef, useEffect } from "react"
import { Mic, ChevronLeft, ChevronRight, Square } from "lucide-react"
import SpotlightCard from "../../components/SpotlightCard"

const RING_R = 24
const CIRC = 2 * Math.PI * RING_R

function RingScore({ pct }) {
  const color = pct >= 80 ? "#10b981" : pct >= 65 ? "#f59e0b" : "#ef4444"
  const dash = (pct / 100) * CIRC
  return (
    <div className="relative w-[58px] h-[58px] flex-shrink-0">
      <svg width="58" height="58" viewBox="0 0 58 58" className="-rotate-90">
        <circle cx="29" cy="29" r={RING_R} fill="none" stroke="#1e293b" strokeWidth="4" />
        <circle cx="29" cy="29" r={RING_R} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash.toFixed(1)} ${CIRC.toFixed(1)}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold" style={{ color }}>
        {pct}%
      </div>
    </div>
  )
}

function ScoreCard({ label, pct, desc }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 mb-3 flex items-center gap-4 shadow-md transition-transform hover:scale-[1.01] hover:bg-white/[0.04]">
      <div className="flex-1">
        <div className="text-sm font-bold text-slate-200 mb-1">{label}</div>
        <div className="text-xs text-slate-400 leading-relaxed font-medium">{desc}</div>
      </div>
      <RingScore pct={pct} />
    </div>
  )
}

// Import local assets
import video1 from "../../assets/first.mp4"
import video2 from "../../assets/video2.mp4"
import video3 from "../../assets/video3.mp4"
import video4 from "../../assets/video4.mp4"
import video5 from "../../assets/video5.mp4"
import video6 from "../../assets/video6.mp4"
import video7 from "../../assets/video7.mp4"

const questionsList = [
  {
      video: video1,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      title: "What are your weaknesses?",
      subtitle: "Speak about your areas of improvement honestly."
  },
  {
      video: video3,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      title: "Why should we hire you?",
      subtitle: "Highlight your unique skills and how they match the role."
  },
  {
      video: video2,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "Where do you see yourself in 5 years?",
      subtitle: "Discuss your career goals and ambitions."
  },
  {
      video: video4,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "Tell me about yourself",
      subtitle: "Start by introducing yourself and your background."
  },
  {
      video: video5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "What is your greatest strength?",
      subtitle: "Highlight your primary strengths with examples."
  },
  {
      video: video6,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "What makes you stand out from other candidates?",
      subtitle: "Detail your unique selling propositions."
  },
  {
      video: video7,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "How would you handle challenging situations?",
      subtitle: "Discuss a situational conflict or hurdle and your solution."
  },
  {
      video: video1,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      title: "Why do you want to work with our company?",
      subtitle: "Discuss your alignment with corporate values and products."
  }
]

export default function Practice() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [audioURL, setAudioURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [videoError, setVideoError] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const videoRef = useRef(null)

  // Timer logic
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recording]);

  // Ensure video automatically plays and loads on slide change
  useEffect(() => {
    setTranscript("")
    setFeedback(null)
    setAudioURL("")
    setTimer(0)
    setVideoError(false)
    
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log('Autoplay blocked by browser.', e));
    }
  }, [currentQuestionIdx])

  const startRecording = async () => {
    // Pause video when recording begins
    if (videoRef.current) {
      videoRef.current.pause()
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => { 
        if (e.data.size > 0) chunksRef.current.push(e.data) 
      }
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        if (blob.size > 0) uploadAudio(blob)
      }
      
      mediaRecorder.start()
      setRecording(true)
      setTimer(0)
    } catch(err) {
      console.error("Mic access denied", err)
      alert("Please allow microphone access to practice speaking.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const toggleRecording = () => {
    if (recording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const uploadAudio = async (blob) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", blob, "recording.webm")
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://127.0.0.1:8000/api/v1/upload", { 
        method: "POST", 
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData 
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setTranscript(data.transcript || "")
      setFeedback(data.feedback || null)
      // Check if URL is already a full Cloudinary URL
      const audioUrl = data.mp3_url;
      const fullAudioUrl = audioUrl && (audioUrl.startsWith("http://") || audioUrl.startsWith("https://"))
        ? audioUrl
        : audioUrl ? `http://127.0.0.1:8000/${audioUrl}` : "";
      setAudioURL(fullAudioUrl)
    } catch(err) {
      console.error(err)
      alert("Failed to process audio.")
    } finally {
      setLoading(false)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIdx < questionsList.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1)
    }
  }

  const currentQuestion = questionsList[currentQuestionIdx]

  return (
    <div className="min-h-screen bg-[#050506] text-[#EDEDEF] flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-x-hidden bg-grid-pattern">
      {/* Background Noise Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-40"></div>

      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow" style={{ animationDelay: '-3s' }}></div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between mb-4 z-10 relative">
        <a href="/" className="flex items-center gap-1.5 text-brand-muted hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </a>
        <h1 className="text-xs font-bold text-brand-accent tracking-wider uppercase">
          AI Speaking Practice
        </h1>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start my-auto z-10 py-4 relative">
        
        {/* LEFT COLUMN: Interviewer Studio Panel (Sticky/Fixed on scroll) */}
        <section className="w-full md:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl text-center md:sticky md:top-8 min-h-[350px]">
          
          {/* Avatar / Video Wrapper */}
          <div className="relative mb-6">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl relative transition-all duration-300 ${recording ? 'ring-4 ring-red-500/30' : 'ring-4 ring-brand-accent/10'}`}>
              {currentQuestion.video && !videoError ? (
                <video 
                  ref={videoRef}
                  src={currentQuestion.video} 
                  autoPlay 
                  loop 
                  playsInline
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play().catch(e => console.log(e));
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <img 
                      src={currentQuestion.avatar} 
                      alt="AI" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                    {recording && (
                      <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-200 mb-1">AI Behavior Coach</h3>
          <p className="text-xs text-brand-muted mb-6">Speak with absolute clarity and detail</p>

          {/* Timer and Recording Indicators */}
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-2 bg-[#0a0a0c]/80 border border-white/[0.04] rounded-full px-4 py-1.5 shadow-inner">
              <span className={`w-2.5 h-2.5 rounded-full ${recording ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="font-mono text-xs text-slate-300 font-semibold tracking-wider uppercase">
                {recording ? `Recording: ${timer}s` : 'Ready to record'}
              </span>
            </div>

            {/* Mic Action Button */}
            <div className="relative mt-2">
              {recording && (
                <>
                  <div className="absolute inset-[-14px] bg-red-500/15 rounded-full animate-ping pointer-events-none"></div>
                  <div className="absolute inset-[-6px] bg-red-500/10 rounded-full animate-pulse pointer-events-none"></div>
                </>
              )}
              <button 
                onClick={toggleRecording}
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 ${
                  recording 
                    ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_24px_rgba(220,38,38,0.4)]' 
                    : 'bg-brand-accent hover:bg-brand-accentBright shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                }`}
              >
                {recording ? <Square size={22} fill="currentColor" /> : <Mic size={26} />}
              </button>
            </div>
            
            {/* Visual soundwaves when recording */}
            {recording && (
              <div className="flex items-center gap-1.5 mt-4 h-6">
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 bg-red-500 rounded-full animate-[soundwave_1.2s_ease-in-out_infinite]"
                    style={{ 
                      height: `${val * 20}%`, 
                      animationDelay: `${idx * 0.12}s` 
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Question slide & Feedback (Movable/Scrollable) */}
        <section className="w-full md:col-span-7 flex flex-col gap-6 self-stretch">
          
          {/* Question Display Card */}
          <SpotlightCard className="p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
                <span className="text-xs font-semibold tracking-wider text-brand-accent uppercase">
                  Question {currentQuestionIdx + 1} of {questionsList.length}
                </span>
                
                {/* Navigation Chevrons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIdx === 0}
                    className="p-1.5 rounded-lg bg-[#050506] border border-white/[0.06] hover:border-white/[0.1] text-brand-foreground disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIdx === questionsList.length - 1}
                    className="p-1.5 rounded-lg bg-[#050506] border border-white/[0.06] hover:border-white/[0.1] text-brand-foreground disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Question Text Area */}
              <div className="px-2 py-4">
                <h2 className="text-lg md:text-xl font-bold leading-relaxed text-slate-100 mb-2">
                  {currentQuestion.title}
                </h2>
                <p className="text-xs md:text-sm text-brand-muted">
                  {currentQuestion.subtitle}
                </p>
              </div>
            </div>
          </SpotlightCard>

          {/* Results/Feedback section */}
          <div className="w-full flex flex-col gap-4">
            {/* Loading State */}
            {loading && (
              <div className="w-full bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-brand-accent font-medium animate-pulse text-xs">Analyzing your response...</p>
              </div>
            )}

            {/* Transcript */}
            {transcript && !loading && (
              <SpotlightCard className="p-5 animate-[fadeIn_0.5s_ease-out]">
                <p className="text-brand-accent font-semibold text-xs mb-2 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🗣</span> Your Answer
                </p>
                <p className="text-slate-300 leading-relaxed text-sm">{transcript}</p>
              </SpotlightCard>
            )}

            {/* Audio URL */}
            {audioURL && !loading && (
              <SpotlightCard className="p-4 animate-[fadeIn_0.5s_ease-out]">
                <p className="text-emerald-400 font-semibold text-xs mb-3 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🎧</span> Playback
                </p>
                <audio controls src={audioURL} className="w-full filter invert hue-rotate-180 opacity-95"></audio>
              </SpotlightCard>
            )}

            {/* AI Response Block initial placeholder */}
            {!loading && !transcript && !feedback && (
              <div className="w-full bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5">
                <p className="text-indigo-400 font-semibold text-xs mb-2 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  AI Evaluation Feedback
                </p>
                <p className="text-brand-muted text-xs leading-relaxed">
                  Provide your spoken answer above. The AI will evaluate clarity, general grammar, vocabulary, and pronunciation.
                </p>
              </div>
            )}

            {/* Detailed Feedback */}
            {feedback && !loading && (
              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl animate-[fadeIn_0.6s_ease-out] flex flex-col">
                {/* Total Score Header */}
                <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border-b border-white/[0.04] p-6 text-center">
                  <p className="text-brand-accent text-xs mb-1 uppercase tracking-wider font-semibold">Overall Performance</p>
                  <div className="text-4xl font-extrabold text-white mb-2">{feedback.scores.total}%</div>
                  <p className="text-yellow-400 text-xs font-medium px-4">{feedback.messages.total}</p>
                </div>

                <div className="p-5">
                  {/* Individual Scores */}
                  {[
                    { key: "grammar", label: "Grammar" },
                    { key: "fluency", label: "Fluency" },
                    { key: "vocabulary", label: "Vocabulary" },
                    { key: "pronunciation", label: "Pronunciation" },
                  ].map(({ key, label }) => (
                    <ScoreCard key={key} label={label} pct={feedback.scores[key]} desc={feedback.messages[key]} />
                  ))}

                  {/* Improved statement */}
                  {feedback.improved && (
                    <div className="mt-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-4">
                      <p className="text-emerald-400 font-bold text-xs mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🌟</span> Better Way to Say It
                      </p>
                      <p className="text-emerald-100 italic leading-relaxed text-sm">
                        "{feedback.improved}"
                      </p>
                    </div>
                  )}

                  {/* Tips */}
                  {feedback.tips?.length > 0 && (
                    <div className="mt-4 bg-purple-950/30 border border-purple-800/40 rounded-xl p-4">
                      <p className="text-purple-400 font-bold text-xs mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <span>💡</span> Speaking Tips
                      </p>
                      <ul className="space-y-2">
                        {feedback.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-purple-200 text-xs">
                            <span className="text-purple-400 font-bold">•</span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-brand-muted z-10 border-t border-white/[0.04] mt-4 relative">
        © {new Date().getFullYear()} DevTalkAI Practice Studio. All rights reserved.
      </footer>
    </div>
  )
}