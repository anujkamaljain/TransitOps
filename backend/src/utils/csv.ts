function escapeCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(
  columns: { key: string; header: string }[],
  rows: Record<string, unknown>[],
): string {
  const headerLine = columns.map((column) => escapeCell(column.header)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((column) => escapeCell(row[column.key])).join(","),
  );
  return [headerLine, ...dataLines].join("\r\n");
}
