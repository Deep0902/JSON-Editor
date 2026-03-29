'use client';

import { useMemo, useState } from 'react';
import { type XMLNode } from '../utils/xmlValidator';

interface XMLTableRow {
  label: string;
  value: string;
  type: 'attribute' | 'text' | 'element';
  internalPath: string;
  displayPath: string;
}

interface XMLTableViewProps {
  data: XMLNode;
  onEdit?: (path: string, value: string) => void;
}

function flattenXML(node: XMLNode, internalPath = 'root', displayPath = `/${node.tag}`): XMLTableRow[] {
  const rows: XMLTableRow[] = [
    {
      label: node.tag,
      value: `<${node.tag}>`,
      type: 'element',
      internalPath,
      displayPath,
    },
  ];

  Object.entries(node.attributes).forEach(([key, value]) => {
    rows.push({
      label: `@${key}`,
      value,
      type: 'attribute',
      internalPath: `${internalPath}.attributes.${key}`,
      displayPath: `${displayPath}/@${key}`,
    });
  });

  rows.push({
    label: '#text',
    value: node.text,
    type: 'text',
    internalPath: `${internalPath}.text`,
    displayPath: `${displayPath}/text()`,
  });

  node.children.forEach((child, index) => {
    rows.push(...flattenXML(child, `${internalPath}.children.${index}`, `${displayPath}/${child.tag}[${index}]`));
  });

  return rows;
}

export default function XMLTableView({ data, onEdit }: XMLTableViewProps) {
  const rows = useMemo(() => flattenXML(data), [data]);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const saveEdit = (path: string) => {
    onEdit?.(path, editValue);
    setEditingPath(null);
  };

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg" style={{ maxHeight: '400px' }}>
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">Label</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">Value</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900 border-r border-gray-200">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">Path</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.internalPath}-${index}`}
              className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="px-4 py-2 text-gray-900 font-semibold border-r border-gray-200">{row.label}</td>
              <td className="px-4 py-2 text-gray-700 border-r border-gray-200 break-all font-mono text-xs max-w-xs whitespace-nowrap">
                {row.type === 'element' ? (
                  <span>{row.value}</span>
                ) : editingPath === row.internalPath ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(row.internalPath)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(row.internalPath);
                      if (e.key === 'Escape') setEditingPath(null);
                    }}
                    className="w-full px-2 py-1 border border-gray-400 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                ) : (
                  <span
                    onClick={() => {
                      setEditingPath(row.internalPath);
                      setEditValue(row.value);
                    }}
                    className="cursor-pointer hover:bg-gray-200 px-1 rounded inline-block"
                  >
                    {row.value || '(empty)'}
                  </span>
                )}
              </td>
              <td className="px-4 py-2 border-r border-gray-200">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    row.type === 'attribute'
                      ? 'bg-blue-100 text-blue-800'
                      : row.type === 'text'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {row.type}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-600 text-xs font-mono truncate">{row.displayPath}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
