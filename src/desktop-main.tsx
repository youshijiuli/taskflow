import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import { useGoalsStore } from './store/goalsStore';
import { supabase } from './supabase/client';
import DesktopLayout from './components/DesktopLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Projects from './pages/Projects';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import GoalFormPage from './pages/GoalFormPage';
import './desktop.css';

const DesktopLoginPage = lazy(() => import('./components/DesktopLoginPage'));

function DesktopApp() {
  const [session, setSession] = useState<unknown | null>(undefined);
  const loadTasks = useTaskStore((s) => s.load);
  const loadProjects = useProjectStore((s) => s.load);
  const loadGoals = useGoalsStore((s) => s.load);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        (window as unknown as Record<string, unknown>).__supabaseUserId = session.user.id;
        loadTasks(session.user.id);
        loadProjects(session.user.id);
        loadGoals(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        (window as unknown as Record<string, unknown>).__supabaseUserId = session.user.id;
        loadTasks(session.user.id);
        loadProjects(session.user.id);
        loadGoals(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#2a2a3a] border-t-[#f0a050] animate-spin" />
          <p className="text-sm text-[#5c5a6c] font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0e0e16]" />}>
        <DesktopLoginPage onLogin={() => setSession(true)} />
      </Suspense>
    );
  }

  return (
    <DesktopLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/task/new" element={<TaskForm />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/task/:id/edit" element={<TaskForm />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<GoalDetailPage />} />
        <Route path="/goals/new" element={<GoalFormPage />} />
        <Route path="/goals/:id/edit" element={<GoalFormPage />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </DesktopLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <DesktopApp />
    </HashRouter>
  </React.StrictMode>
);
