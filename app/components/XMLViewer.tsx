'use client';

import { useState } from 'react';
import XMLTreeView from './XMLTreeView';
import XMLTableView from './XMLTableView';
import { type XMLNode } from '../utils/xmlValidator';

interface XMLViewerProps {
  data: XMLNode;
  onDataChange?: (updatedData: XMLNode) => void;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function setByPath(target: unknown, path: string, value: string): void {
  const parts = path.split('.');
  if (parts[0] === 'root') {
    parts.shift();
  }

  if (parts.length === 0) {
    return;
  }

  let current: any = target;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    const nextPart = parts[i + 1];
    const isNextArrayIndex = /^\d+$/.test(nextPart ?? '');

    if (/^\d+$/.test(part)) {
      const index = Number(part);
      const currentArray: any[] = current;
      if (!currentArray[index]) {
        currentArray[index] = isNextArrayIndex ? [] : {};
      }
      current = currentArray[index];
      continue;
    }

    if (current[part] === undefined) {
      current[part] = isNextArrayIndex ? [] : {};
    }
    current = current[part] as Record<string, unknown>;
  }

  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart)) {
    const index = Number(lastPart);
    (current as any[])[index] = value;
    return;
  }

  current[lastPart] = value;
}

export default function XMLViewer({ data, onDataChange }: XMLViewerProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'table'>('tree');

  const handleEdit = (path: string, value: string) => {
    const newData = deepClone(data);
    setByPath(newData, path, value);
    onDataChange?.(newData);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-900">XML Output (Editable)</label>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tree')}
          className={`px-4 py-2 font-medium transition-colors duration-200 ${
            activeTab === 'tree'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Tree View
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`px-4 py-2 font-medium transition-colors duration-200 ${
            activeTab === 'table'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Table View
        </button>
      </div>

      {activeTab === 'tree' && <XMLTreeView data={data} onEdit={handleEdit} />}
      {activeTab === 'table' && <XMLTableView data={data} onEdit={handleEdit} />}
    </div>
  );
}
