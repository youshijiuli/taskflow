import { useParams, useNavigate } from 'react-router-dom';
import { useGoalsStore } from '../store/goalsStore';
import GoalForm from './GoalForm';

export default function GoalFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const objectives = useGoalsStore((s) => s.objectives);
  const krs = useGoalsStore((s) => s.krs);
  const addObjective = useGoalsStore((s) => s.addObjective);
  const updateObjective = useGoalsStore((s) => s.updateObjective);
  const removeObjective = useGoalsStore((s) => s.removeObjective);
  const addKeyResult = useGoalsStore((s) => s.addKeyResult);
  const updateKeyResult = useGoalsStore((s) => s.updateKeyResult);
  const removeKeyResult = useGoalsStore((s) => s.removeKeyResult);

  const existing = id ? objectives.find((o) => o.id === id) : undefined;
  const existingKRs = existing ? krs.filter((kr) => kr.objectiveId === id) : [];

  return (
    <GoalForm
      objective={existing}
      existingKRs={existingKRs}
      onSave={async (objData, krsData) => {
        if (existing) {
          await updateObjective(existing.id, objData);
          // Update KRs: add new ones, update existing, delete removed
          const existingIds = existingKRs.map((kr) => kr.id);
          const updatedIds = krsData.filter((kr) => kr.id && existingIds.includes(kr.id)).map((kr) => kr.id);

          for (const kr of krsData) {
            if (kr.id && updatedIds.includes(kr.id)) {
              await updateKeyResult(kr.id, kr);
            } else {
              await addKeyResult({ ...kr, objectiveId: existing.id });
            }
          }
          for (const ekr of existingKRs) {
            if (!krsData.find((kr) => kr.id === ekr.id)) {
              await removeKeyResult(ekr.id);
            }
          }
        } else {
          const newObj = await addObjective(objData);
          if (newObj) {
            for (const kr of krsData) {
              await addKeyResult({ ...kr, objectiveId: newObj.id });
            }
          }
        }
        navigate('/');
      }}
      onDelete={existing ? () => { if (confirm('删除这个目标？')) { removeObjective(existing.id); navigate('/'); } } : undefined}
    />
  );
}
