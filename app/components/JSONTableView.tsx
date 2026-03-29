'use client';

import { useMemo, useState } from 'react';

interface TableRow {
  key: string;
  value: string;
  type: string;
  path: string;
}

function flattenJSON(obj: unknown, prefix = ''): TableRow[] {
  const rows: TableRow[] = [];

  function traverse(current: unknown, path: string) {
    if (current === null) {
      rows.push({
        key: path.split('.').pop() || 'value',
        value: 'null',
        type: 'null',
        path,
      });
      return;
    }

    if (typeof current !== 'object') {
      const types = typeof current;
      const displayValue =
        typeof current === 'string' ? current : String(current);
      rows.push({
        key: path.split('.').pop() || 'value',
        value: displayValue,
        type: types,
        path,
      });
      return;
    }

    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, path ? `${path}[${index}]` : `[${index}]`);
      });
    } else {
      Object.entries(current).forEach(([key, value]) => {
        traverse(value, path ? `${path}.${key}` : key);
      });
    }
  }

  traverse(obj, prefix);
  return rows;
}

interface JSONTableViewProps {
  data: unknown;
  onEdit?: (path: string, value: unknown) => void;
}

export default function JSONTableView({ data, onEdit }: JSONTableViewProps) {
  const rows = useMemo(() => flattenJSON(data), [data]);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (path: string, newValue: string, type: string) => {
    let value: unknown = newValue;
    
    if (type === 'boolean') {
      value = newValue.toLowerCase() === 'true';
    } else if (type === 'number') {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        value = numValue;
      }
    } else if (type === 'null') {
      value = null;
    }
    
    onEdit?.(path, value);
    setEditingPath(null);
  };

  if (rows.length === 0) {
    return (
      <div className="p-4 text-gray-600 text-center">
        No data to display
      </div>
    );
  }

  const maxHeight = Math.min(rows.length * 40 + 50, 400);

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg" style={{ maxHeight: `${maxHeight}px` }}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">
              Key
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">
              Value
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Path
            </th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="px-4 py-2 text-gray-900 font-semibold border-r border-gray-200 truncate">
                {row.key}
              </td>
              <td className="px-4 py-2 text-gray-700 border-r border-gray-200 break-all font-mono text-xs max-w-xs whitespace-nowrap">
                {editingPath === row.path ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleEdit(row.path, editValue, row.type)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleEdit(row.path, editValue, row.type);
                      if (e.key === 'Escape') setEditingPath(null);
                    }}
                    className="w-full px-2 py-1 border border-gray-400 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingPath(row.path);
                      setEditValue(row.value);
                    }}
                    className="cursor-pointer hover:bg-gray-200 px-1 rounded inline-block"
                  >
                    {row.value.length > 50 ? row.value.substring(0, 50) + '...' : row.value}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 border-r border-gray-200">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    row.type === 'string'
                      ? 'bg-green-100 text-green-800'
                      : row.type === 'number'
                        ? 'bg-blue-100 text-blue-800'
                        : row.type === 'boolean'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {row.type}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-600 text-xs font-mono truncate">
                {row.path}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
