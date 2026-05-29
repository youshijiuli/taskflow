import { useParams, useNavigate } from 'react-router-dom';
import { useGoalsStore } from '../store/goalsStore';
import { useTaskStore } from '../store/taskStore';
import GoalDetail from './GoalDetail';

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const objectives = useGoalsStore((s) => s.objectives);
  const krs = useGoalsStore((s) => s.krs);
  const tasks = useTaskStore((s) => s.tasks);
  const updateKeyResult = useGoalsStore((s) => s.updateKeyResult);
  const removeObjective = useGoalsStore((s) => s.removeObjective);

  const objective = objectives.find((o) => o.id === id);
  const objKRs = krs.filter((kr) => kr.objectiveId === id);
  const krIds = objKRs.map((kr) => kr.id);
  const linkedTasks = tasks.filter((t) => t.keyResultId && krIds.includes(t.keyResultId));

  if (!objective) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="font-semibold text-gray-400">目标不存在</p>
        <button onClick={() => navigate('/')} className="mt-3 text-purple-500 text-sm font-bold">返回</button>
      </div>
    );
  }

  return (
    <GoalDetail
      objective={objective}
      krs={objKRs}
      linkedTasks={linkedTasks}
      onToggleKR={async (krId, current) => {
        await updateKeyResult(krId, {
          status: current === 'completed' ? 'active' : 'completed',
          progress: current === 'completed' ? 0 : 100,
        });
      }}
      onDelete={() => { removeObjective(objective.id); navigate(-1); }}
    />
  );
}
