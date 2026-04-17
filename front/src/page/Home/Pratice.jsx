import { useState, useRef, useEffect } from "react"
import { Mic, ChevronLeft, ChevronRight } from "lucide-react"

// Import local assets
import video1 from "../../assets/first.mp4"
import video2 from "../../assets/video2.mp4"
import video3 from "../../assets/video3.mp4"
import video4 from "../../assets/video4.mp4"
import video5 from "../../assets/video5.mp4"
import video6 from "../../assets/video6.mp4"
import video7 from "../../assets/video7.mp4"
// import video8 from "../../assets/video8.mp4"        
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
        title: "what is greatest Strength of yours?",
        subtitle: "Discuss your career goals and ambitions."
    },
    {
        video: video6,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        title: "Whats makes you stand out from other candidates unique?",
        subtitle: "Discuss your career goals and ambitions."
    },
    {
        video: video7,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        title: "How would you handle challenging situations ?",
        subtitle: "Discuss your career goals and ambitions."
    },
    {
        video: video1,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        title: "Why Do you want to work with us{your company}",
        subtitle: "Discuss your career goals and ambitions."
    }

]

export default function Practice() {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const videoRef = useRef(null)

    // Ensure video automatically plays whenever we switch slides
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play().catch(e => console.log('Autoplay blocked by browser. User must click video.', e));
        }
    }, [currentQuestionIdx])

    const toggleVideo = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex justify-center items-center px-4 py-6 overflow-hidden">

            <div className="w-full max-w-5xl flex items-center justify-between gap-2 md:gap-8">

                {/* Outer Left Arrow */}
                <button
                    onClick={prevQuestion}
                    disabled={currentQuestionIdx === 0}
                    className="p-3 md:p-5 rounded-full bg-white/80 shadow-lg text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition active:scale-95 z-10"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                {/* Main Content Area (Changes completely per question) */}
                <div key={currentQuestionIdx} className="flex-1 w-full max-w-md md:max-w-2xl mx-auto flex flex-col items-center animate-[fadeIn_0.4s_ease-out]">

                    {/* Avatar / Video Circle */}
                    <div className="flex justify-center mb-6 w-full">
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-xl border-4 border-white transform transition-transform hover:scale-105">
                            {/* Replace with video later */}
                            {currentQuestion.video ? (
                                <video
                                    ref={videoRef}
                                    src={currentQuestion.video}
                                    autoPlay
                                    loop
                                    playsInline
                                    onClick={toggleVideo}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                />
                            ) : (
                                <img
                                    src={currentQuestion.avatar}
                                    alt="AI"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-center text-2xl md:text-3xl font-bold text-blue-700 mb-6 drop-shadow-sm">
                        AI Speaking Practice
                    </h1>

                    <div className="w-full space-y-4 md:space-y-6 flex flex-col max-w-lg">
                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 w-full border border-blue-50">
                            <p className="text-blue-500 font-medium text-sm mb-2 uppercase tracking-wide">
                                Question {currentQuestionIdx + 1} of {questionsList.length}
                            </p>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                {currentQuestion.title}
                            </h2>
                            <p className="text-gray-500 text-sm md:text-base">
                                {currentQuestion.subtitle}
                            </p>
                        </div>

                        {/* Timer */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-4 flex items-center gap-4 w-full">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                                0s
                            </div>
                            <p className="text-gray-700 font-medium">Ready to record...</p>
                        </div>

                        {/* Mic Button */}
                        <div className="flex justify-center py-2 relative">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                            </div>
                            <button className="relative w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 active:scale-95">
                                <Mic size={28} />
                            </button>
                        </div>

                        {/* AI Response Placeholder */}
                        <div className="bg-white rounded-2xl shadow-md p-5 border border-indigo-50/50">
                            <p className="text-indigo-500 font-semibold text-sm mb-2 uppercase tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                AI Feedback
                            </p>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Your feedback will appear here. The AI is listening for clarity, grammar, and overall confidence in your response to this specific question.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Outer Right Arrow */}
                <button
                    onClick={nextQuestion}
                    disabled={currentQuestionIdx === questionsList.length - 1}
                    className="p-3 md:p-5 rounded-full bg-white/80 shadow-lg text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition active:scale-95 z-10"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>

            </div>

            {/* Simple CSS animation injected for fade in effect */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    )
}