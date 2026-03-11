'use client';

import { useState } from 'react';
import JSONTreeView from './JSONTreeView';
import JSONTableView from './JSONTableView';

interface JSONViewerProps {
  data: unknown;
  onDataChange?: (updatedData: unknown) => void;
}

export default function JSONViewer({ data, onDataChange }: JSONViewerProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'table'>('tree');

  const handleEdit = (path: string, value: unknown) => {
    const newData = JSON.parse(JSON.stringify(data)); // Deep clone
    const pathParts = path.split('.');
    let current = newData;

    // Navigate to the parent of the target property
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (part.includes('[')) {
        // Handle array index notation like "arr[0]"
        const [arrayName, index] = part.match(/(\w+)\[(\d+)\]/)?.slice(1, 3) || [];
        if (arrayName && index !== undefined) {
          if (!current[arrayName]) current[arrayName] = [];
          current = current[arrayName][parseInt(index)];
        }
      } else {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }

    // Set the value at the target property
    const lastPart = pathParts[pathParts.length - 1];
    if (lastPart.includes('[')) {
      const [arrayName, index] = lastPart.match(/(\w+)\[(\d+)\]/)?.slice(1, 3) || [];
      if (arrayName && index !== undefined) {
        if (!current[arrayName]) current[arrayName] = [];
        current[arrayName][parseInt(index)] = value;
      }
    } else {
      current[lastPart] = value;
    }

    onDataChange?.(newData);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-900">JSON Output (Editable)</label>
      
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

      {activeTab === 'tree' && <JSONTreeView data={data} onEdit={handleEdit} />}
      {activeTab === 'table' && <JSONTableView data={data} onEdit={handleEdit} />}
    </div>
  );
}
