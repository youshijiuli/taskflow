import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../supabase/client';
import LoginPage from './LoginPage';

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
      <div className="flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-purple-200 border-t-purple-500 animate-spin" />
          <p className="text-sm text-gray-400 font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLogin={() => setSession(true)} />;
  }

  return <>{children}</>;
}
