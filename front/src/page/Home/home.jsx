import { useState, useEffect } from "react"
import { Mic, Award, MessageSquare, LogOut, ArrowRight, Menu, X, Sparkles } from "lucide-react"
import Chat from "./Chat"
import SpotlightCard from "../../components/SpotlightCard"

function PracticeMockWindow() {
  return (
    <div className="w-full bg-[#0a0a0c] rounded-2xl border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-none select-none">
      {/* macOS Title Bar */}
      <div className="h-10 bg-[#0d0d11] border-b border-white/[0.04] px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="text-[10px] font-mono text-brand-muted tracking-wider">
          devtalkai.com/practice
        </span>
        <div className="w-12" /> {/* Spacer */}
      </div>
      
      {/* Window Content */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-start text-left bg-[#050506]">
        
        {/* Left Card: Interviewer Panel */}
        <div className="md:col-span-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-xl relative mb-4 ring-4 ring-brand-accent/10">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
              alt="AI Coach" 
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-xs font-bold text-slate-200 mb-0.5">AI Behavior Coach</h4>
          <p className="text-[9px] text-brand-muted mb-4">Speak with absolute clarity and detail</p>
          
          <div className="flex items-center gap-1.5 bg-[#0a0a0c] border border-white/[0.04] rounded-full px-3 py-1 text-[8px] font-mono tracking-wider uppercase text-emerald-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            READY TO RECORD
          </div>
          
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] text-brand-accent">
            <Mic className="w-4 h-4" />
          </div>
        </div>
        
        {/* Right Columns: Question and Feedback */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Question Card */}
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 border-b border-white/[0.04] pb-2 text-[9px] text-brand-muted uppercase font-semibold">
              <span>Question 1 of 8</span>
              <div className="flex items-center gap-1">
                <span className="p-0.5 bg-slate-950 border border-white/[0.04] rounded text-slate-500">&lt;</span>
                <span className="p-0.5 bg-slate-950 border border-white/[0.04] rounded text-slate-500">&gt;</span>
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-bold text-white mb-1.5">What are your weaknesses?</h3>
            <p className="text-[10px] md:text-[11px] text-brand-muted">Speak about your areas of improvement honestly.</p>
          </div>
          
          {/* Feedback Card */}
          <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-5">
            <div className="flex items-center gap-1.5 text-[8px] font-bold tracking-wider uppercase text-brand-accent mb-2">
              <span className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" />
              AI Evaluation Feedback
            </div>
            <p className="text-[10px] md:text-[11px] text-brand-muted leading-relaxed">
              Provide your spoken answer above. The AI will evaluate clarity, general grammar, vocabulary, and pronunciation.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

function FaqAccordion({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-white/[0.04] py-4 text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs md:text-sm font-bold text-brand-foreground hover:text-white transition-colors"
      >
        <span>{question}</span>
        <span className="text-brand-accent text-sm md:text-base font-mono">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <p className="mt-2.5 text-[11px] md:text-xs text-brand-muted leading-relaxed animate-fadeIn">
          {answer}
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const [authToken, setAuthToken] = useState(null)
  const [userName, setUserName] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const name = localStorage.getItem("userName")
    setAuthToken(token)
    if (name) setUserName(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userName")
    setAuthToken(null)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-[#050506] text-[#EDEDEF] flex flex-col font-sans relative overflow-x-hidden bg-grid-pattern">
      {/* Background Noise Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-40"></div>

      {/* Overflow-hidden Container to Clip Ambient Blobs and Avoid Blank Spaces */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/4 w-[900px] h-[900px] rounded-full bg-brand-accent/5 blur-[160px] animate-float-slow"></div>
        <div className="absolute bottom-[-10%] right-1/4 w-[700px] h-[700px] rounded-full bg-indigo-500/5 blur-[130px] animate-float-slow" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* Top Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.04] z-20 relative">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗣️</span>
          <span className="font-extrabold text-lg bg-gradient-to-r from-brand-accent via-indigo-400 to-brand-accent bg-clip-text text-transparent tracking-wide">
            DevTalkAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-brand-muted">
            <a href="#how-it-works" className="hover:text-brand-foreground transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-brand-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-brand-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-brand-foreground transition-colors">FAQ</a>
          </nav>
          
          {/* Conditionally rendered Sign In / Log Out button */}
          {authToken ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-brand-muted">
                Hello, <strong className="text-brand-foreground">{userName}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground border border-white/[0.06] text-xs font-bold transition-all active:scale-[0.98] shadow-md flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="px-4.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground border border-white/[0.06] text-xs font-bold transition-all active:scale-[0.98] shadow-md"
            >
              Sign In
            </a>
          )}
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-brand-muted hover:text-brand-foreground"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#050506]/95 backdrop-blur-xl border-b border-white/[0.06] py-6 px-6 z-30 flex flex-col gap-5 animate-[fadeIn_0.2s_ease-out]">
          <a 
            href="#how-it-works" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-semibold text-brand-muted hover:text-brand-foreground transition-colors py-2 border-b border-white/[0.02]"
          >
            How It Works
          </a>
          <a 
            href="#testimonials" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-semibold text-brand-muted hover:text-brand-foreground transition-colors py-2 border-b border-white/[0.02]"
          >
            Testimonials
          </a>
          <a 
            href="#pricing" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-semibold text-brand-muted hover:text-brand-foreground transition-colors py-2 border-b border-white/[0.02]"
          >
            Pricing
          </a>
          <a 
            href="#faq" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-semibold text-brand-muted hover:text-brand-foreground transition-colors py-2 border-b border-white/[0.02]"
          >
            FAQ
          </a>
          {authToken ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center justify-center py-3 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs text-center shadow-md mt-2 gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          ) : (
            <a
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 rounded-lg bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-xs text-center shadow-md mt-2"
            >
              Get Started
            </a>
          )}
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 pt-20 pb-16 z-10 flex flex-col justify-center text-center relative">
        
        {/* Banner advertisement */}
        <div className="inline-flex items-center gap-1.5 bg-brand-accent/10 border border-brand-accent/25 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase text-brand-accent mb-6 mx-auto animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Reduce Software Concepts Speaking Fear
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text leading-[1.08] mb-6 max-w-4xl mx-auto">
          Master English Speaking for{" "}
          <span className="bg-gradient-to-r from-brand-accent via-indigo-400 to-[#9b66ff] bg-clip-text text-transparent">
            Software Developers
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed mb-10">
          The best way to overcome interview anxiety is speaking practice. Spin random software engineering questions, explain them verbally, and receive instant AI analysis on your grammar, fluency, vocabulary, and pronunciation!
        </p>

        {/* Conditional Hero CTA Buttons */}
        {authToken ? (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <a
              href="/practice"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-[0.98] text-center flex items-center justify-center gap-2"
            >
              Open Practice Studio <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/mic"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground font-bold text-sm border border-white/[0.06] transition-all duration-200 active:scale-[0.98] text-center"
            >
              Spin / Speak for Software Development
            </a>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-200 active:scale-[0.98] text-center flex items-center justify-center gap-2"
            >
              Start Practice Now <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground font-bold text-sm border border-white/[0.06] transition-all duration-200 active:scale-[0.98] text-center"
            >
              Create Free Account
            </a>
          </div>
        )}

        {/* macOS Practice Mock Window Demo */}
        <div className="w-full max-w-4xl mx-auto mb-28 animate-[fadeIn_0.8s_ease-out]">
          <PracticeMockWindow />
        </div>

        {/* How It Works Section */}
        <section className="w-full max-w-5xl mx-auto py-20 border-t border-white/[0.04]" id="how-it-works">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest text-brand-accent uppercase">Three Simple Steps</span>
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text tracking-tight mt-2">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-6 flex flex-col justify-between text-left">
              <div>
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center text-brand-accent font-bold text-xs mb-4">
                  1
                </div>
                <h3 className="text-sm font-bold text-brand-foreground mb-2">Select a Question</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Choose from structured behavioral interview questions or spin the roulette wheel for a random technical backend topic (CAP, caching, APIs).
                </p>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="p-6 flex flex-col justify-between text-left">
              <div>
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center text-brand-accent font-bold text-xs mb-4">
                  2
                </div>
                <h3 className="text-sm font-bold text-brand-foreground mb-2">Speak Your Answer</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Click the record button and explain the concept verbally, simulating a live technical phone screen or developer interview.
                </p>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="p-6 flex flex-col justify-between text-left">
              <div>
                <div className="w-8 h-8 rounded-full bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center text-brand-accent font-bold text-xs mb-4">
                  3
                </div>
                <h3 className="text-sm font-bold text-brand-foreground mb-2">Get AI Evaluations</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Mira transcribes your answer and generates a detailed report. For technical queries, you get a correctness score, covered points, and model answers.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* Bento features Section */}
        <section className="w-full max-w-5xl mx-auto py-20 border-t border-white/[0.04]">
          <div className="mb-10 text-center md:text-left">
            <span className="text-xs font-mono tracking-widest text-brand-accent uppercase">Engineered Features</span>
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text mt-2">Bento Speaking Suite</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[220px]">
            {/* Bento Card 1: col-span-7 */}
            <SpotlightCard className="md:col-span-7 md:row-span-1 p-6 md:p-8 flex flex-col justify-between text-left">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <Mic className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-foreground mb-1.5">Spin / Speak Roulette</h3>
                <p className="text-xs md:text-sm text-brand-muted leading-relaxed max-w-md">
                  Tackle technical backend questions (SQL migrations, CAP theorem, or rate limiting) to stretch your verbal explanation skills in front of an automated AI timer.
                </p>
              </div>
              <a href={authToken ? "/mic" : "/login"} className="text-xs font-bold text-brand-accent hover:text-brand-foreground transition-colors flex items-center gap-1 mt-4">
                Explore spin / speak roulette <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>

            {/* Bento Card 2: col-span-5 */}
            <SpotlightCard className="md:col-span-5 md:row-span-1 p-6 md:p-8 flex flex-col justify-between text-left">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-foreground mb-1.5">Multi-Metric Scoring</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Speak on behavioral slides and receive instant scores on grammar, fluency, vocabulary, and pronunciation.
                </p>
              </div>
              <a href={authToken ? "/practice" : "/login"} className="text-xs font-bold text-brand-accent hover:text-brand-foreground transition-colors flex items-center gap-1 mt-4">
                View scoring criteria <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </SpotlightCard>

            {/* Bento Card 3: col-span-12 */}
            <SpotlightCard className="md:col-span-12 md:row-span-1 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
              <div className="max-w-xl">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-foreground mb-1.5">Right-hand AI Speaking Partner</h3>
                <p className="text-xs md:text-sm text-brand-muted leading-relaxed">
                  Practice interactive mock dialogues with Mira inside our floating modal widget. Test your technical terminology, ask software-related questions, and get direct conversation feedback.
                </p>
              </div>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="px-5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground text-xs font-bold border border-white/[0.06] active:scale-[0.98] transition-all flex-shrink-0"
              >
                Launch Mira Widget 💬
              </button>
            </SpotlightCard>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full max-w-5xl mx-auto py-20 border-t border-white/[0.04]" id="testimonials">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest text-brand-accent uppercase">Success Stories</span>
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text tracking-tight mt-2">
              Loved by Software Engineers
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <SpotlightCard className="p-6 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed italic mb-6">
                "Practicing out loud with DevTalkAI reduced my backend interview anxiety. I went from stuttering about databases to explaining CAP theorem partition tolerance with complete confidence."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-brand-accent">
                  SK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-foreground">Siddharth Kumar</h4>
                  <p className="text-[10px] text-brand-muted">Backend Engineer at Vercel</p>
                </div>
              </div>
            </SpotlightCard>
            
            <SpotlightCard className="p-6 flex flex-col justify-between">
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed italic mb-6">
                "The instant technical feedback on what concepts I missed changed the game for me. It doesn't just grade grammar; it actually evaluates the accuracy of my systems explanations."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-brand-accent">
                  AM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-foreground">Alex Martinez</h4>
                  <p className="text-[10px] text-brand-muted">Infrastructure Engineer at Stripe</p>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full max-w-5xl mx-auto py-20 border-t border-white/[0.04]" id="pricing">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest text-brand-accent uppercase">Simple & Transparent</span>
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text tracking-tight mt-2">
              Flexible Pricing Plans
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Free Tier */}
            <SpotlightCard className="p-6 md:p-8 flex flex-col justify-between border-white/[0.04] bg-white/[0.01]">
              <div>
                <h3 className="text-lg font-bold text-brand-foreground">Free Tier</h3>
                <p className="text-xs text-brand-muted mt-1.5 mb-6">Perfect to test your speaking foundation.</p>
                <div className="text-3xl font-black text-white mb-6">$0<span className="text-xs text-brand-muted font-normal">/month</span></div>
                <ul className="space-y-3 text-xs text-brand-muted mb-8">
                  <li className="flex items-center gap-2">✓ 8 general behavioral questions</li>
                  <li className="flex items-center gap-2">✓ Standard AI conversation widget</li>
                  <li className="flex items-center gap-2">✓ Grammar & Fluency evaluation feedback</li>
                </ul>
              </div>
              <a href={authToken ? "/practice" : "/signup"} className="w-full text-center py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-brand-foreground border border-white/[0.06] text-xs font-bold transition-all active:scale-[0.98]">
                {authToken ? "Open Studio" : "Get Started"}
              </a>
            </SpotlightCard>

            {/* Pro Tier */}
            <SpotlightCard className="p-6 md:p-8 flex flex-col justify-between border-brand-accent/30 bg-brand-accent/[0.02] relative">
              <div className="absolute top-4 right-4 bg-brand-accent/20 border border-brand-accent/30 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider text-brand-accent animate-pulse">
                Recommended
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-foreground">Pro Prep</h3>
                <p className="text-xs text-brand-muted mt-1.5 mb-6">Unlimited tech shuffles & correctness review.</p>
                <div className="text-3xl font-black text-white mb-6">$19<span className="text-xs text-brand-muted font-normal">/month</span></div>
                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">✓ Unlimited backend technical questions</li>
                  <li className="flex items-center gap-2">✓ Technical Correctness scoring (CAP, scaling)</li>
                  <li className="flex items-center gap-2">✓ Unlimited voice coach chat with Mira</li>
                  <li className="flex items-center gap-2">✓ Deeper analytics & model answer templates</li>
                </ul>
              </div>
              <a href={authToken ? "/practice" : "/signup"} className="w-full text-center py-2.5 rounded-lg bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-xs shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3)] transition-all active:scale-[0.98]">
                {authToken ? "Unlock Pro Studio" : "Unlock Pro Access"}
              </a>
            </SpotlightCard>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full max-w-3xl mx-auto py-20 border-t border-white/[0.04]" id="faq">
          <div className="text-center mb-12">
            <span className="text-xs font-mono tracking-widest text-brand-accent uppercase">Common Queries</span>
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-1">
            <FaqAccordion 
              question="How does the AI grade my technical correctness?" 
              answer="Our backend evaluates your transcribed response against industry-standard definitions of the specific topic (e.g. partition tolerance, cache invalidation, connection limits) using specialized LLM prompts. It scores you out of 100 on accuracy, outlines points you successfully covered, and details missing concepts to refine."
            />
            <FaqAccordion 
              question="Can I practice without speaking?" 
              answer="You can chat with Mira in textual format using our floating sidebar widget modal. However, we highly recommend unmuting and using the microphone features to practice verbalizing your answers, as this is the best way to reduce interview anxiety and build conversational confidence."
            />
            <FaqAccordion 
              question="Is my practice data secure?" 
              answer="Yes. Your audio recordings are processed solely to compute transcription and feedback reports. They are stored temporarily and are never shared or sold."
            />
            <FaqAccordion 
              question="Can I cancel my Pro subscription at any time?" 
              answer="Absolutely. You can manage and cancel your Pro subscription from your user dashboard at any time with a single click. You will retain access to Pro features until the end of your billing cycle."
            />
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="w-full max-w-4xl mx-auto py-24 text-center z-10 relative border-t border-white/[0.04]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none"></div>
          
          <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-gradient-to-b from-white to-white/70 bg-clip-text tracking-tight mb-4">
            Conquer Your Next Coding Interview
          </h2>
          <p className="text-xs md:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed mb-8">
            Practice software development explanations in English, reduce speaking anxiety, and verify your correctness under pressure. Join today!
          </p>
          <a
            href={authToken ? "/practice" : "/signup"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all active:scale-[0.98]"
          >
            {authToken ? "Go to Practice Studio" : "Get Started for Free"} <ArrowRight className="w-4 h-4" />
          </a>
        </section>

      </main>

      {/* Floating Chat Modal format (Widget on Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-brand-accent hover:bg-brand-accentBright text-white font-bold text-xs sm:text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-4 h-4" /> 
          {isChatOpen ? "Close Coach Chat" : "Chat with Mira 💬"}
        </button>

        {/* Modal container */}
        {isChatOpen && (
          <div className="w-[340px] sm:w-[360px] h-[480px] sm:h-[500px] mt-4 shadow-2xl animate-[fadeIn_0.3s_ease-out]">
            <Chat isWidget={true} onClose={() => setIsChatOpen(false)} />
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="w-full border-t border-white/[0.04] bg-[#020203] z-10 relative py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-left mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🗣️</span>
              <span className="font-extrabold text-sm bg-gradient-to-r from-brand-accent to-indigo-400 bg-clip-text text-transparent tracking-wide">
                DevTalkAI
              </span>
            </div>
            <p className="text-[10px] text-brand-muted leading-relaxed max-w-[180px]">
              Helping software developers communicate technical ideas with complete confidence.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-mono tracking-widest text-[#EDEDEF] uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-[10px] text-brand-muted font-medium">
              <li><a href={authToken ? "/practice" : "/login"} className="hover:text-white transition-colors">Behavior Coach</a></li>
              <li><a href={authToken ? "/mic" : "/login"} className="hover:text-white transition-colors">Spin / Speak</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pro Tiers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono tracking-widest text-[#EDEDEF] uppercase mb-3">Resources</h4>
            <ul className="space-y-2 text-[10px] text-brand-muted font-medium">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono tracking-widest text-[#EDEDEF] uppercase mb-3">Company</h4>
            <ul className="space-y-2 text-[10px] text-brand-muted font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] text-brand-muted border-t border-white/[0.04] pt-6">
          <p>© {new Date().getFullYear()} DevTalkAI Studio. All rights reserved.</p>
          <p>Obsessively crafted for developers.</p>
        </div>
      </footer>
    </div>
  )
}