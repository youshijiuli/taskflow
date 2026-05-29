import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import InstallPrompt from './InstallPrompt';

const tabs = [
  { path: '/', label: '概览' },
  { path: '/tasks', label: '任务' },
  { path: '/projects', label: '项目' },
];

const TabIcon = ({ name, active }: { name: string; active: boolean }) => {
  const a = active;
  if (name === '概览') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke={a ? '#f472b6' : '#d1d5db'} strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke={a ? '#f472b6' : '#d1d5db'} strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke={a ? '#f472b6' : '#d1d5db'} strokeWidth="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" stroke={a ? '#f472b6' : '#d1d5db'} strokeWidth="2" />
        {a && <rect x="4" y="4" width="5" height="5" rx="1" fill="#f472b6" opacity="0.2" />}
      </svg>
    );
  }
  if (name === '任务') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M9 5h10M9 12h10M9 19h7" stroke={a ? '#8b5cf6' : '#d1d5db'} strokeWidth="2" strokeLinecap="round" />
        <circle cx="4.5" cy="5" r="2" fill={a ? '#f472b6' : '#e5e7eb'} />
        <circle cx="4.5" cy="12" r="2" fill={a ? '#8b5cf6' : '#e5e7eb'} />
        <circle cx="4.5" cy="19" r="2" fill={a ? '#34d399' : '#e5e7eb'} />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" stroke={a ? '#34d399' : '#d1d5db'} strokeWidth="2" />
      {a && <path d="M22 13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2l2-3h5l2 3h9a2 2 0 0 1 2 2z" fill="#34d399" opacity="0.15" />}
    </svg>
  );
};

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const title = () => {
    if (location.pathname.startsWith('/task/')) return null;
    if (location.pathname === '/tasks') return '任务';
    if (location.pathname === '/projects') return '项目';
    return 'TaskFlow';
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-5 py-4 sticky top-0 z-10 bg-transparent">
        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          {title()}
        </h1>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-3 left-3 right-3 z-20">
        <div className="max-w-[456px] mx-auto flex justify-around py-2 px-1 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] border border-gray-100"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 4px)' }}>
          {tabs.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-300 ${
                isActive(path) ? 'scale-105' : 'hover:opacity-70'
              }`}
            >
              <TabIcon name={label} active={isActive(path)} />
              <span className={`text-[10px] font-semibold tracking-wide ${
                isActive(path) ? 'text-gray-800' : 'text-gray-300'
              }`}>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <InstallPrompt />
    </div>
  );
}
