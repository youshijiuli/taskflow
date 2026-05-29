import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Projects from './pages/Projects';

export default function App() {
  const loadTasks = useTaskStore((s) => s.load);
  const loadProjects = useProjectStore((s) => s.load);

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, [loadTasks, loadProjects]);

  return (
    <AuthGuard>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/task/new" element={<TaskForm />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/task/:id/edit" element={<TaskForm />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Layout>
    </AuthGuard>
  );
}
