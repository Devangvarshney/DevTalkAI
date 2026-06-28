import { useState, useRef, useEffect } from "react"
import { Mic, Square, Shuffle, ChevronLeft } from "lucide-react"
import SpotlightCard from "../../components/SpotlightCard"

const CATEGORIES = [
  "Database Migration",
  "NoSQL vs SQL",
  "API Security",
  "Query Optimization",
  "Caching & Redis",
  "High Concurrency",
  "HTTP Request Lifecycle",
  "Microservices",
  "OAuth & JWT Auth",
  "Event-Driven Architecture",
  "System Architecture",
  "Connection Pooling",
  "API Rate Limiting",
  "CAP Theorem"
]

const BACKEND_QUESTIONS = [
  "How do you handle database migrations and schema changes in a production system with zero downtime?",
  "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
  "How do you secure a REST API against common security vulnerabilities like SQL injection, XSS, and CSRF?",
  "What is your approach to diagnosing and optimizing a slow-running SQL query or API endpoint?",
  "Explain the concepts of horizontal scaling, vertical scaling, and caching using tools like Redis.",
  "How do you handle high concurrency, race conditions, and data consistency in a distributed system?",
  "Describe the life cycle of an HTTP request from the moment the user clicks a button to when the backend responds.",
  "What are microservices, and how do services securely and reliably communicate with each other?",
  "How do you implement secure authentication and authorization using OAuth 2.0 and JSON Web Tokens (JWT)?",
  "How do you design a database schema for a high-traffic e-commerce cart and checkout system?",
  "How do you implement rate limiting on your API to protect against service denial and abuse?",
  "Explain the CAP theorem and how it influences your choice of database in distributed systems.",

  // Security
  "What is encryption and decryption? Explain symmetric and asymmetric encryption with real-world examples.",
  "Which algorithms are commonly used for encryption and decryption? Explain AES, RSA, ECC, and ChaCha20.",
  "What hashing algorithms are commonly used for password storage? Explain bcrypt, Argon2, PBKDF2, and why SHA-256 alone is not enough.",
  "What is the difference between hashing, encryption, and encoding?",

  // JWT
  "How does JWT work internally? Explain the Header, Payload, and Signature.",
  "Which algorithms are used to sign JWT tokens? Explain HS256, RS256, ES256, and when to use each.",
  "How do you securely store and validate JWT tokens in a web application?",
  "What is the difference between access tokens and refresh tokens?",

  // Networking
  "What is DNS? Explain the complete DNS resolution process from entering a URL to receiving an IP address.",
  "What is a load balancer? Why is it needed in scalable applications?",
  "Explain different load balancing algorithms such as Round Robin, Least Connections, IP Hash, and Weighted Round Robin.",
  "What is the difference between Layer 4 and Layer 7 load balancers?",
  "What happens when you type a URL into the browser? Explain the complete request lifecycle including DNS, TCP, TLS, HTTP, backend processing, and response.",

  // HTTPS & TLS
  "What is SSL/TLS? How does the HTTPS handshake work?",
  "How does public key cryptography establish a secure HTTPS connection?",
  "What is the difference between HTTP and HTTPS?",

  // System Design
  "How would you design a backend that handles 10 million requests per day?",
  "How would you improve the performance of a REST API under heavy traffic?",
  "How do CDNs, caching, and load balancers work together in a production system?"
];

export default function Practice() {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [audioURL, setAudioURL] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  
  const [currentQuestion, setCurrentQuestion] = useState("Click 'Pick Random Topic' to get started!")
  const [isShuffling, setIsShuffling] = useState(false)
  const [shufflingText, setShufflingText] = useState("🎲 Selecting random backend topic...")
  const [videoError, setVideoError] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const videoRef = useRef(null)

  // Initial random question selection
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BACKEND_QUESTIONS.length)
    setCurrentQuestion(BACKEND_QUESTIONS[randomIndex])
  }, [])

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

  const shuffleTopic = () => {
    if (isShuffling) return
    setIsShuffling(true)
    setTranscript("")
    setFeedback(null)
    setAudioURL("")
    setTimer(0)
    
    // Play video if it's paused
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(e => console.log('Autoplay blocked by browser.', e))
    }

    let counter = 0
    const totalSteps = 15
    let currentDelay = 60

    const cycle = () => {
      counter++
      const randomQuestionIdx = Math.floor(Math.random() * BACKEND_QUESTIONS.length)
      const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
      
      // Show intermediate rolling topic category text
      setShufflingText(`🎲 Selecting: ${randomCategory}...`)
      
      if (counter < totalSteps) {
        currentDelay += 25
        setTimeout(cycle, currentDelay)
      } else {
        // Finish shuffle: set actual question and stop shuffling state
        setCurrentQuestion(BACKEND_QUESTIONS[randomQuestionIdx])
        setIsShuffling(false)
      }
    }

    setTimeout(cycle, currentDelay)
  }

  const startRecording = async () => {
    // Stop the video when user starts recording
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
    formData.append("question", currentQuestion)
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://127.0.0.1:8000/api/v1/upload-technical", { 
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

  return (
    <div className="min-h-screen bg-[#050506] text-[#EDEDEF] flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-x-hidden bg-grid-pattern">
      {/* Background Noise Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-40"></div>

      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow" style={{ animationDelay: '-3.5s' }}></div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between mb-4 z-10 relative">
        <a href="/" className="flex items-center gap-1.5 text-brand-muted hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </a>
        <h1 className="text-xs font-bold text-brand-accent tracking-wider uppercase">
          Software Concepts
        </h1>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start my-auto z-10 py-4 relative">
        
        {/* LEFT COLUMN: Interviewer Studio Panel (Sticky/Fixed on scroll) */}
        <section className="w-full md:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl text-center md:sticky md:top-8 min-h-[350px]">
          
          {/* Avatar / Video Wrapper */}
          <div className="relative mb-6">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl relative transition-all duration-300 ${recording ? 'ring-4 ring-red-500/30' : 'ring-4 ring-brand-accent/10'}`}>
              <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center relative rounded-full overflow-hidden">
                {/* Layer 1: Outer Ambient Glow */}
                <div className={`absolute w-36 h-36 rounded-full blur-2xl opacity-35 transition-all duration-700 ${
                  recording 
                    ? 'bg-red-500 scale-125 animate-pulse' 
                    : 'bg-brand-accent scale-100 animate-pulse-slow'
                }`} />
                
                {/* Layer 2: Middle Fluid Orb */}
                <div className={`absolute w-24 h-24 rounded-full blur-lg opacity-60 transition-all duration-500 ${
                  recording 
                    ? 'bg-gradient-to-tr from-red-500 via-pink-500 to-rose-600 scale-110 animate-float-slow' 
                    : 'bg-gradient-to-tr from-indigo-500 via-[#8F43EE] to-brand-accent animate-float-slow'
                }`} />
                
                {/* Layer 3: Inner Core */}
                <div className={`absolute w-16 h-16 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 ${
                  recording 
                    ? 'bg-gradient-to-tr from-red-400 to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                    : 'bg-gradient-to-tr from-indigo-400 to-brand-accent shadow-[0_0_20px_rgba(94,106,210,0.4)]'
                }`} />
                
                {/* Center Symbol: Soundwave or Mic */}
                {recording && (
                  <div className="absolute inset-0 flex items-center justify-center gap-1 z-10">
                    {[1, 2.5, 4, 2.5, 1].map((val, idx) => (
                      <div 
                        key={idx} 
                        className="w-1 bg-white rounded-full animate-soundwave"
                        style={{ 
                          height: `${val * 6}px`, 
                          animationDelay: `${idx * 0.15}s` 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {isShuffling && (
              <div className="absolute inset-0 rounded-full border-4 border-t-brand-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-200 mb-1">AI Software Concepts Interviewer</h3>
          <p className="text-xs text-brand-muted mb-6">Explain your answer clearly and concisely</p>

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
                disabled={isShuffling}
                className={`w-16 h-16 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
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

        {/* RIGHT COLUMN: Topic Card & Feedback (Movable/Scrollable) */}
        <section className="w-full md:col-span-7 flex flex-col gap-6 self-stretch animate-fadeIn">
          
          {/* Topic Display Card using SpotlightCard */}
          <SpotlightCard className="p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold tracking-wider text-brand-accent uppercase">
                  Topic for Discussion
                </span>
                {isShuffling && (
                  <span className="text-[10px] font-semibold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full animate-pulse border border-brand-accent/20">
                    Shuffling
                  </span>
                )}
              </div>
              
              {/* Topic Text Area */}
              <div className="min-h-[7rem] flex items-center justify-center text-center px-2 py-4">
                {isShuffling ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-accent animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                    <p className="text-base font-bold text-brand-muted animate-pulse tracking-wide italic">
                      {shufflingText}
                    </p>
                  </div>
                ) : (
                  <h2 className="text-base md:text-lg font-bold leading-relaxed text-slate-100 animate-[fadeIn_0.4s_ease-out]">
                    {currentQuestion}
                  </h2>
                )}
              </div>
            </div>

            {/* Shuffle Control Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={shuffleTopic}
                disabled={isShuffling || recording}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-brand-accent to-indigo-600 hover:from-brand-accentBright hover:to-indigo-500 text-white font-semibold text-xs md:text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                Pick Random Topic
              </button>
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
                  Technical Feedback
                </p>
                <p className="text-brand-muted text-xs leading-relaxed">
                  Provide your spoken answer above. The AI will evaluate your technical correctness, list key points you explained correctly, and suggest missing concepts to make your answer complete.
                </p>
              </div>
            )}

            {/* Detailed Feedback */}
            {feedback && !loading && (
              <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl animate-[fadeIn_0.6s_ease-out] flex flex-col">
                {/* Total Score Header */}
                <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border-b border-white/[0.04] p-6 text-center">
                  <p className="text-brand-accent text-xs mb-1 uppercase tracking-wider font-semibold">Technical Accuracy</p>
                  <div className="text-4xl font-extrabold text-white mb-2">{feedback.score}%</div>
                  <p className="text-yellow-400 text-xs font-medium px-4">{feedback.feedback_summary}</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Key Points Covered */}
                  {feedback.key_points_covered?.length > 0 && (
                    <div className="bg-slate-950/50 border border-white/[0.04] rounded-xl p-4">
                      <p className="text-emerald-400 font-bold text-xs mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <span>✓</span> Key Points You Covered
                      </p>
                      <ul className="space-y-2">
                        {feedback.key_points_covered.map((point, i) => (
                          <li key={i} className="flex gap-2 text-slate-300 text-xs items-start">
                            <span className="text-emerald-500 font-bold">✓</span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Missing Concepts */}
                  {feedback.missing_concepts?.length > 0 && (
                    <div className="bg-slate-950/50 border border-white/[0.04] rounded-xl p-4">
                      <p className="text-yellow-400 font-bold text-xs mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <span>💡</span> Key Concepts to Include / Refine
                      </p>
                      <ul className="space-y-2">
                        {feedback.missing_concepts.map((concept, i) => (
                          <li key={i} className="flex gap-2 text-slate-300 text-xs items-start">
                            <span className="text-yellow-500 font-bold">•</span>
                            <span className="leading-relaxed">{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improved statement */}
                  {feedback.improved && (
                    <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-xl p-4">
                      <p className="text-brand-accent font-bold text-xs mb-2 uppercase tracking-wide flex items-center gap-1.5">
                        <span>🌟</span> Better Way to Explain It
                      </p>
                      <p className="text-indigo-200 italic leading-relaxed text-sm">
                        "{feedback.improved}"
                      </p>
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
        © {new Date().getFullYear()} DevTalkAI Software Concepts. All rights reserved.
      </footer>
    </div>
  )
}
