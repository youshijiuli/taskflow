import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import { useGoalsStore } from './store/goalsStore';
import { supabase } from './supabase/client';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Projects from './pages/Projects';
import GoalsPage from './pages/GoalsPage';
import GoalDetailPage from './pages/GoalDetailPage';
import GoalFormPage from './pages/GoalFormPage';
import DesktopDashboard from './pages/DesktopDashboard';

const isElectron = !!(window as unknown as { electronAPI?: { isElectron: boolean } }).electronAPI?.isElectron;

export default function App() {
  const loadTasks = useTaskStore((s) => s.load);
  const loadProjects = useProjectStore((s) => s.load);
  const loadGoals = useGoalsStore((s) => s.load);

  useEffect(() => {
    const loadAll = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        (window as unknown as Record<string, unknown>).__supabaseUserId = userId;
        await Promise.all([loadTasks(userId), loadProjects(userId), loadGoals(userId)]);
      }
    };
    loadAll();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id;
      if (userId) {
        (window as unknown as Record<string, unknown>).__supabaseUserId = userId;
        loadTasks(userId);
        loadProjects(userId);
        loadGoals(userId);
      }
    });
    return () => subscription.unsubscribe();
  }, [loadTasks, loadProjects, loadGoals]);

  // Desktop: read-only dashboard
  if (isElectron) {
    return (
      <AuthGuard>
        <DesktopDashboard />
      </AuthGuard>
    );
  }

  // Mobile: full CRUD
  return (
    <AuthGuard>
      <Layout>
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
      </Layout>
    </AuthGuard>
  );
}
