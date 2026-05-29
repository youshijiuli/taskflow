import { useState } from 'react';
import { supabase } from '../supabase/client';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }
    setError('');
    setLoading(true);

    if (isRegister) {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message);
      } else {
        // Registration successful - auto login
        onLogin();
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message === 'Invalid login credentials'
          ? '邮箱或密码错误'
          : err.message);
      } else {
        onLogin();
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6h10M9 12h10M9 18h7" />
              <circle cx="4.5" cy="6" r="2" fill="white" opacity="0.4" />
              <circle cx="4.5" cy="12" r="2" fill="white" opacity="0.4" />
              <circle cx="4.5" cy="18" r="2" fill="white" opacity="0.4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">TaskFlow</h1>
          <p className="text-sm text-gray-400 mt-1">个人 OKR 效率管理</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 scale-in">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-base font-medium placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少6位"
              disabled={loading}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-base font-medium placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all"
            />
          </div>
          {error && <p className="text-sm text-rose-500 font-medium text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-purple-200 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? '登录中...' : isRegister ? '注册' : '登录'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          {isRegister ? '已有账号？' : '没有账号？'}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-purple-500 font-bold ml-1"
          >
            {isRegister ? '去登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  );
}
