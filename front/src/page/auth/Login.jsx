import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#191b21] flex items-center justify-center p-5 font-sans">
      <div className="bg-[#191b21] rounded-[16px] px-10 py-12 w-full max-w-[420px] shadow-[0_16px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] flex flex-col gap-8">
        
        <div className="text-center">
          <h1 className="text-[#f8fafc] text-[28px] font-semibold tracking-tight m-0">Welcome Back</h1>
          <p className="text-[#94a3b8] text-[15px] mt-2 mb-0">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[#cbd5e1] text-[14px] font-medium ml-0.5">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#0f1115] border border-[#334155] rounded-[10px] px-4 py-3.5 text-[#f8fafc] text-[15px] outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-[#12141a] focus:ring-4 focus:ring-indigo-500/15 placeholder-[#475569]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[#cbd5e1] text-[14px] font-medium ml-0.5">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#0f1115] border border-[#334155] rounded-[10px] px-4 py-3.5 text-[#f8fafc] text-[15px] outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-[#12141a] focus:ring-4 focus:ring-indigo-500/15 placeholder-[#475569]"
              required
            />
          </div>

          <div className="flex justify-between items-center text-[13px] -mt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#cbd5e1]">
              <input type="checkbox" className="accent-indigo-500 w-4 h-4 rounded border-gray-600 bg-gray-700" />
              Remember me
            </label>
            <a href="#" className="text-indigo-400 font-medium no-underline transition-colors hover:text-indigo-300">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className="bg-indigo-500 text-white border-0 rounded-[10px] p-3.5 text-[16px] font-semibold cursor-pointer transition-all hover:bg-indigo-600 active:scale-95 mt-1"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-[#94a3b8] text-[14px]">
          Don't have an account? 
          <a href="/auth/signup" className="text-indigo-400 font-medium no-underline ml-1 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
