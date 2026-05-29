import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard';

const COLORS = ['#f472b6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4', '#84cc16'];

export default function Projects() {
  const projects = useProjectStore((s) => s.projects);
  const addProject = useProjectStore((s) => s.add);
  const removeProject = useProjectStore((s) => s.remove);
  const tasks = useTaskStore((s) => s.tasks);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addProject(name.trim(), color, '📁');
    setName(''); setColor(COLORS[0]); setShowForm(false);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-gray-800">项目管理</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="w-11 h-11 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 card-press">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {showForm ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M12 5v14M5 12h14"/>}
          </svg>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-3xl p-4 space-y-3 slide-up">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="项目名称" autoFocus
            className="w-full px-4 py-3 bg-white rounded-2xl text-sm font-semibold placeholder:text-gray-300 focus:ring-2 focus:ring-purple-300 transition-all" />
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className="w-9 h-9 rounded-2xl border-2 transition-all card-press"
                style={{ backgroundColor: c, borderColor: color === c ? '#1e1b2e' : 'transparent', transform: color === c ? 'scale(1.1)' : 'scale(1)', boxShadow: color === c ? `0 0 0 4px ${c}25` : 'none' }} />
            ))}
          </div>
          <button onClick={handleAdd}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl text-sm font-bold card-press">创建项目</button>
        </div>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400">暂无项目</p>
          <p className="text-xs text-gray-300 mt-1">点击 + 创建项目组织任务</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const isExpanded = expanded === project.id;
            const doneCount = projectTasks.filter((t) => t.status === 'done').length;
            return (
              <div key={project.id}>
                <button onClick={() => setExpanded(isExpanded ? null : project.id)}
                  className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-4 border border-white/80 shadow-sm card-press text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold shadow-sm" style={{ backgroundColor: project.color }}>
                      {project.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{project.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{projectTasks.length} 任务 · {doneCount} 完成</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm(`删除项目「${project.name}」？`)) removeProject(project.id); }}
                      className="p-1.5 text-gray-300 hover:text-rose-400 ml-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </button>
                {isExpanded && (
                  <div className="mt-2 ml-2 space-y-2 border-l-2 border-purple-100 pl-4">
                    {projectTasks.length === 0 ? (
                      <p className="text-xs text-gray-300 py-3 text-center">暂无任务</p>
                    ) : (
                      projectTasks.map((task) => <TaskCard key={task.id} task={task} />)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
