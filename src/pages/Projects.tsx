import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import TaskCard from '../components/TaskCard';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];

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
    setName('');
    setColor(COLORS[0]);
    setShowForm(false);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">项目管理</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-all hover:bg-indigo-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {showForm ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M12 5v14M5 12h14"/>}
          </svg>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="项目名称"
            className="w-full px-4 py-3 bg-white border-0 rounded-xl text-sm font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-400 transition-all"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-xl border-2 transition-all active:scale-90"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? '#171717' : 'transparent',
                  transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: color === c ? `0 0 0 3px ${c}30` : 'none',
                }}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            className="w-full py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
          >
            创建项目
          </button>
        </div>
      )}

      {projects.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-400">暂无项目</p>
          <p className="text-xs text-gray-300 mt-1">点击 + 创建项目来组织任务</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const isExpanded = expanded === project.id;
            const doneCount = projectTasks.filter((t) => t.status === 'done').length;
            return (
              <div key={project.id}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : project.id)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: project.color }}>
                      {project.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{project.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {projectTasks.length} 个任务 · {doneCount} 已完成
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4d4d4" strokeWidth="2" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm(`删除项目「${project.name}」？`)) removeProject(project.id); }}
                        className="p-1 text-gray-300 hover:text-red-400 ml-1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 ml-2 space-y-2 border-l-2 border-gray-100 pl-4">
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
