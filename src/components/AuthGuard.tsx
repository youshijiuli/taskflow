import { useEffect, useState, type ReactNode, lazy, Suspense } from 'react';
import { supabase } from '../supabase/client';
import LoginPage from './LoginPage';

const DesktopLoginPage = lazy(() => import('./DesktopLoginPage'));

const isElectron = !!(window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron;

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<unknown | null>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className={`flex items-center justify-center min-h-dvh ${isElectron ? 'bg-[#0e0e16]' : ''}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-3 ${isElectron ? 'border-[#2a2a3a] border-t-[#f0a050]' : 'border-purple-200 border-t-purple-500'} animate-spin`} />
          <p className={`text-sm font-medium ${isElectron ? 'text-[#5c5a6c]' : 'text-gray-400'}`}>加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    if (isElectron) {
      return (
        <Suspense fallback={<div className="min-h-screen bg-[#0e0e16]" />}>
          <DesktopLoginPage onLogin={() => setSession(true)} />
        </Suspense>
      );
    }
    return <LoginPage onLogin={() => setSession(true)} />;
  }

  return <>{children}</>;
}
