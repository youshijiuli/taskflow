export function formatDate(ts: number | null): string {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function formatDateTime(ts: number | null): string {
  if (!ts) return '';
  return new Date(ts).toLocaleString('zh-CN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function daysUntil(ts: number): number {
  const now = Date.now();
  return Math.ceil((ts - now) / (1000 * 60 * 60 * 24));
}

export function isOverdue(ts: number): boolean {
  return ts < Date.now();
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function formatFullDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
