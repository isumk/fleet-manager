export function formatStatus(status: string) {
  return status.replaceAll('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function statusColor(status: string) {
  switch (status) {
    case 'working': return 'bg-green-100 text-green-700 border-green-200';
    case 'not_working': return 'bg-red-100 text-red-700 border-red-200';
    case 'inactive': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.join(','), ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))].join('\n');
}
