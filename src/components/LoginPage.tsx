import { useState } from 'react';
import { supabase } from '../supabase/client';
import CodeInput from './CodeInput';

type Step = 'email' | 'code';

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStep('code');
    }
  };

  const handleVerifyCode = async (code: string) => {
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: 'email',
    });
    setLoading(false);
    if (err) {
      setError('验证码错误，请重试');
    } else {
      onLogin();
    }
  };

  const handleBack = () => {
    setStep('email');
    setError('');
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

        {step === 'email' ? (
          <div className="space-y-4 scale-in">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-base font-medium placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-rose-500 font-medium text-center">{error}</p>}
            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-purple-200 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? '发送中...' : '发送验证码'}
            </button>
          </div>
        ) : (
          <div className="space-y-5 scale-in">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">验证码已发送至</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{email}</p>
            </div>
            <CodeInput length={6} onComplete={handleVerifyCode} disabled={loading} />
            {error && <p className="text-sm text-rose-500 font-medium text-center">{error}</p>}
            {loading && (
              <div className="flex justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin" />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold text-sm active:scale-[0.98] transition-all"
              >
                返回
              </button>
              <button
                onClick={() => handleSendCode()}
                disabled={loading}
                className="flex-1 py-3 text-purple-500 text-sm font-semibold active:scale-[0.98] transition-all disabled:opacity-50"
              >
                重新发送
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
