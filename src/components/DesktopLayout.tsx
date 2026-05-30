import { useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

const NAV = [
  { path: '/', label: '概览', icon: 'overview' },
  { path: '/tasks', label: '任务', icon: 'tasks' },
  { path: '/goals', label: '目标', icon: 'goals' },
  { path: '/projects', label: '项目', icon: 'projects' },
];

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? '#f0a050' : '#5c5a6c';
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {name === 'overview' && <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>}
      {name === 'tasks' && <>
        <path d="M9 5h10M9 12h10M9 19h7" />
        <circle cx="4.5" cy="5" r="2" fill={active ? '#f0a050' : 'none'} />
        <circle cx="4.5" cy="12" r="2" fill={active ? '#f0a050' : 'none'} />
        <circle cx="4.5" cy="19" r="2" fill={active ? '#f0a050' : 'none'} />
      </>}
      {name === 'goals' && <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill={active ? '#f0a050' : 'none'} />
      </>}
      {name === 'projects' && <>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />
      </>}
    </svg>
  );
}

export default function DesktopLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#0e0e16] text-[#ede8e0] font-body">
      {/* Sidebar */}
      <aside className="w-[220px] border-r border-[#1c1c28] flex flex-col p-5 flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Task<span style={{ color: '#f0a050', textShadow: '0 0 20px rgba(240,160,80,0.2)' }}>Flow</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ path, label, icon }) => {
            const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#1c1c28] text-[#f0a050]'
                    : 'text-[#5c5a6c] hover:text-[#9694a4] hover:bg-[#14141c]'
                }`}
              >
                <NavIcon name={icon} active={active} />
                {label}
              </button>
            );
          })}
        </nav>

        <footer className="text-xs text-[#3a3a4a] pt-4 border-t border-[#1c1c28]">
          数据实时同步 · Supabase
        </footer>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
