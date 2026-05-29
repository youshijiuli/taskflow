import { useState } from 'react';
import { supabase } from '../supabase/client';

export default function DesktopLoginPage({ onLogin }: { onLogin: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('请输入邮箱和密码'); return; }
    if (password.length < 6) { setError('密码至少6位'); return; }
    setError(''); setLoading(true);

    if (isRegister) {
      const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
      if (err) setError(err.message); else onLogin();
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) setError(err.message === 'Invalid login credentials' ? '邮箱或密码错误' : err.message);
      else onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0e16] flex items-center justify-center p-8">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Task<span style={{ color: '#f0a050', textShadow: '0 0 30px rgba(240,160,80,0.3)' }}>Flow</span>
          </h1>
          <p className="text-[#5c5a6c]">个人 OKR 效率管理</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱" disabled={loading} autoFocus
            className="w-full px-4 py-3.5 bg-[#1c1c28] border border-[#2a2a3a] rounded-xl text-base text-[#ede8e0] placeholder-[#5c5a6c] focus:outline-none focus:border-[#f0a050] focus:ring-1 focus:ring-[#f0a050]/30 transition-all"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少6位）" disabled={loading}
            className="w-full px-4 py-3.5 bg-[#1c1c28] border border-[#2a2a3a] rounded-xl text-base text-[#ede8e0] placeholder-[#5c5a6c] focus:outline-none focus:border-[#f0a050] focus:ring-1 focus:ring-[#f0a050]/30 transition-all"
          />
          {error && <p className="text-sm text-[#e8547c] text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-base transition-all"
            style={{ background: 'linear-gradient(135deg, #f0a050, #e8547c)', color: '#fff', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '处理中...' : isRegister ? '注册' : '登录'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#5c5a6c]">
          {isRegister ? '已有账号？' : '没有账号？'}
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-[#f0a050] font-medium ml-1 hover:underline">
            {isRegister ? '去登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  );
}
