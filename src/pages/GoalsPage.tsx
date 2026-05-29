import { useGoalsStore } from '../store/goalsStore';
import { useTaskStore } from '../store/taskStore';
import Goals from './Goals';

export default function GoalsPage() {
  const objectives = useGoalsStore((s) => s.objectives);
  const krs = useGoalsStore((s) => s.krs);
  const tasks = useTaskStore((s) => s.tasks);

  const krsByObjective: Record<string, typeof krs> = {};
  objectives.forEach((o) => {
    krsByObjective[o.id] = krs.filter((kr) => kr.objectiveId === o.id);
  });

  const taskCountByObjective: Record<string, number> = {};
  objectives.forEach((o) => {
    const objKrIds = krs.filter((kr) => kr.objectiveId === o.id).map((kr) => kr.id);
    taskCountByObjective[o.id] = tasks.filter((t) => t.keyResultId && objKrIds.includes(t.keyResultId)).length;
  });

  return <Goals objectives={objectives} krsByObjective={krsByObjective} taskCountByObjective={taskCountByObjective} />;
}
