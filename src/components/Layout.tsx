import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import InstallPrompt from './InstallPrompt';

const tabs = [
  { path: '/', label: '概览' },
  { path: '/tasks', label: '任务' },
  { path: '/projects', label: '项目' },
];

const TabIcon = ({ name, active }: { name: string; active: boolean }) => {
  const c = active ? '#6366f1' : '#a3a3a3';
  if (name === '概览') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8" />
        {active && <rect x="4" y="4" width="5" height="5" rx="1" fill="#6366f1" opacity="0.15" />}
      </svg>
    );
  }
  if (name === '任务') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 6h10M9 12h10M9 18h7" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="4.5" cy="6" r="1.5" fill={active ? '#6366f1' : '#a3a3a3'} />
        <circle cx="4.5" cy="12" r="1.5" fill={active ? '#6366f1' : '#a3a3a3'} />
        <circle cx="4.5" cy="18" r="1.5" fill={active ? '#6366f1' : '#a3a3a3'} />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" stroke={c} strokeWidth="1.8" />
      {active && <path d="M22 13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2l2-3h5l2 3h9a2 2 0 0 1 2 2v0z" fill="#6366f1" opacity="0.1" />}
    </svg>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-5 py-3 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-xl z-10">
        <h1 className="text-lg font-bold tracking-tight text-gray-900">
          TaskFlow
        </h1>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-gray-50">
        <div className="max-w-[480px] mx-auto flex justify-around py-1.5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 4px)' }}>
          {tabs.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all duration-200 ${
                isActive(path)
                  ? 'text-indigo-500'
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <TabIcon name={label} active={isActive(path)} />
              <span className="text-[11px] font-medium tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <InstallPrompt />
    </div>
  );
}
