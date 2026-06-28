import { useEffect, useRef, useState } from "react"
import { Mic, Square, Send } from "lucide-react"

export default function Chat({ isWidget = false, onClose }) {
  const [sessionId, setSessionId] = useState("")
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // 🔥 Start chat
  useEffect(() => {
    const startChat = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const res = await fetch("http://127.0.0.1:8000/api/v1/start", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await res.json()
        setSessionId(data.session_id)
        setMessages([
          { role: "assistant", content: data.reply }
        ])
        if (data.audio_url) {
          playAudio(data.audio_url)
        }
      } catch (err) {
        console.error("Failed to start chat session", err)
      }
    }
    startChat()
  }, [])

  // 🔊 play audio
  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play().catch(e => console.log('Audio playback blocked/failed', e))
  }

  // 🚀 send text
  const sendMessage = async (msg) => {
    const message = msg || input
    if (!message.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: message }])
    setInput("")
    setLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://127.0.0.1:8000/api/v1/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: message
        })
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ])

      if (data.audio_url) {
        playAudio(data.audio_url)
      }

    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // 🎤 start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        sendAudio(blob)
      }

      recorder.start()
      setRecording(true)
    } catch (err) {
      console.error("Mic access denied", err)
      alert("Microphone permission required for speaking.")
    }
  }

  // ⏹ stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  // 📤 send audio → backend
  const sendAudio = async (blob) => {
    const formData = new FormData()
    formData.append("file", blob, "recording.webm")
    formData.append("session_id", sessionId)

    setLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("http://127.0.0.1:8000/api/v1/upload-chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      const data = await res.json()

      // user speech text
      setMessages((prev) => [
        ...prev,
        { role: "user", content: data.transcript }
      ])

      // AI reply
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ])

      if (data.audio_url) {
        playAudio(data.audio_url)
      }

    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className={`flex flex-col ${isWidget ? 'h-full' : 'h-screen'} bg-[#0a0a0c] text-[#EDEDEF] border border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.5)] relative`}>

      {/* Header */}
      <div className="p-4 bg-[#0d0d11] border-b border-white/[0.04] flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          <h1 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Mira - AI Co-Pilot</h1>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-[10px] text-brand-muted hover:text-white transition-colors bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-md border border-white/[0.06] font-semibold"
          >
            Close
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-brand-accent text-white rounded-tr-none shadow-md shadow-brand-accent/10" 
                : "bg-white/[0.02] text-brand-foreground border border-white/[0.04] rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#050506]/50 border border-white/[0.04] rounded-2xl rounded-tl-none px-4 py-2.5 text-[10px] text-brand-muted flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
              </span>
              Mira is response-processing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <div className="p-3 border-t border-white/[0.04] bg-[#0d0d11]/80 flex items-center gap-2 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Practice software explanations..."
          className="flex-1 px-3.5 py-2.5 bg-[#050506] border border-white/[0.08] text-brand-foreground rounded-lg text-xs outline-none focus:border-brand-accent transition-colors"
        />

        <button
          onClick={() => sendMessage()}
          className="bg-brand-accent hover:bg-brand-accentBright text-white p-2.5 rounded-lg transition-all active:scale-[0.95]"
        >
          <Send className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={recording ? stopRecording : startRecording}
          className={`p-2.5 rounded-lg text-white transition-all active:scale-[0.95] flex items-center gap-1 ${
            recording 
              ? "bg-red-600 hover:bg-red-700 animate-pulse shadow-md" 
              : "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
          }`}
        >
          {recording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}