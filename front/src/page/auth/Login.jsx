import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userName', data.user.name);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#EDEDEF] flex items-center justify-center p-5 font-sans relative overflow-hidden bg-grid-pattern">
      {/* Background Noise & Glows */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none animate-float-slow" style={{ animationDelay: '-4s' }}></div>

      <div className="bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl rounded-2xl px-8 py-10 w-full max-w-[420px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 z-10 animate-[fadeIn_0.4s_ease-out]">
        
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold tracking-tight m-0 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-brand-muted text-xs font-mono uppercase tracking-widest mt-2">Sign in to your prep account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-slate-300 text-xs font-semibold ml-0.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#0f0f12] border border-white/10 rounded-lg px-4 py-3 text-brand-foreground text-sm outline-none transition-all duration-200 focus:border-brand-accent focus:bg-[#12141a] focus:ring-4 focus:ring-brand-accent/15 placeholder-[#475569]"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-slate-300 text-xs font-semibold ml-0.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#0f0f12] border border-white/10 rounded-lg px-4 py-3 text-brand-foreground text-sm outline-none transition-all duration-200 focus:border-brand-accent focus:bg-[#12141a] focus:ring-4 focus:ring-brand-accent/15 placeholder-[#475569]"
              required
            />
          </div>

          <div className="flex justify-between items-center text-xs -mt-1 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="accent-brand-accent w-4 h-4 rounded border-gray-600 bg-gray-700" />
              Remember me
            </label>
            <a href="#" className="text-brand-accent font-semibold no-underline transition-colors hover:text-brand-accentBright">
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-brand-accent hover:bg-brand-accentBright text-white font-bold rounded-lg py-3 text-sm shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-brand-muted text-xs border-t border-white/[0.04] pt-4">
          Don't have an account? 
          <a href="/signup" className="text-brand-accent font-semibold no-underline ml-1 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
