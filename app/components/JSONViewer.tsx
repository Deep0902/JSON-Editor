'use client';

import JSONTreeView from './JSONTreeView';
import JSONTableView from './JSONTableView';

interface JSONViewerProps {
  data: unknown;
  onDataChange?: (updatedData: unknown) => void;
}

export default function JSONViewer({ data, onDataChange }: JSONViewerProps) {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-w-0 overflow-auto max-h-130">
          <JSONTreeView data={data} onEdit={handleEdit} />
        </div>
        <div className="min-w-0 overflow-auto max-h-130">
          <JSONTableView data={data} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
