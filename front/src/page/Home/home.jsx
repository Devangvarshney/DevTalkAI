import { useState } from "react"


export default function Home() {
  const [sessionActive, setSessionActive] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center px-4 py-10">
      
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">AI Speaking Coach</h1>
        <p className="text-gray-400">
          Master English with real-time AI feedback
        </p>
      </header>

      {/* Main */}
      <main className="w-full flex justify-center">
        {!sessionActive ? (
          <div className="w-full max-w-xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-lg">
            
            <h2 className="text-xl font-semibold mb-6">
              Start a New Session
            </h2>

            {/* Mode Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                Casual
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                Interview
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                Debate
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={() => setSessionActive(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
            >
              Start Speaking Now
            </button>

          </div>
        ) : (
          <ActiveSession onEnd={() => setSessionActive(false)} />
        )}
      </main>
    </div>
  )
}