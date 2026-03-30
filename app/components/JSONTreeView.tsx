'use client';

import { useEffect, useState } from 'react';

interface TreeAction {
  mode: 'expand' | 'collapse';
  version: number;
}

interface TreeNodeProps {
  nodeKey: string;
  value: unknown;
  level: number;
  onEdit?: (path: string, value: unknown) => void;
  path?: string;
  treeAction: TreeAction;
}

function TreeNode({ nodeKey, value, level, onEdit, path = '', treeAction }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const currentPath = path ? `${path}.${nodeKey}` : nodeKey;

  useEffect(() => {
    setIsExpanded(treeAction.mode === 'expand');
  }, [treeAction]);

  const handleEdit = (newValue: string) => {
    if (typeof value === 'boolean') {
      const boolValue = newValue.toLowerCase() === 'true';
      onEdit?.(currentPath, boolValue);
    } else if (typeof value === 'number') {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onEdit?.(currentPath, numValue);
      }
    } else if (value === null) {
      onEdit?.(currentPath, null);
    } else {
      onEdit?.(currentPath, newValue);
    }
    setIsEditing(false);
  };

  if (value === null) {
    return (
      <div style={{ paddingLeft: `${level * 20}px` }} className="py-1 text-gray-700 group">
        <span className="font-semibold text-gray-900">{nodeKey}:</span>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleEdit(editValue)}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit(editValue)}
            className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="null"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditing(true);
              setEditValue('null');
            }}
            className="ml-2 text-gray-600 cursor-pointer hover:bg-gray-100 px-1 rounded"
          >
            null
          </span>
        )}
      </div>
    );
  }

  if (typeof value !== 'object') {
    const displayValue =
      typeof value === 'string' ? `"${value}"` : String(value);
    const valueType = typeof value;
    const typeColor =
      valueType === 'boolean'
        ? 'text-purple-600'
        : valueType === 'number'
          ? 'text-blue-600'
          : 'text-green-600';

    return (
      <div style={{ paddingLeft: `${level * 20}px` }} className="py-1 text-gray-700 group">
        <span className="font-semibold text-gray-900">{nodeKey}:</span>
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleEdit(editValue)}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit(editValue)}
            className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        ) : (
          <span
            onClick={() => {
              setIsEditing(true);
              setEditValue(typeof value === 'string' ? value : String(value));
            }}
            className={`ml-2 ${typeColor} cursor-pointer hover:bg-gray-100 px-1 rounded`}
          >
            {displayValue}
          </span>
        )}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries: Array<[string, unknown]> = isArray 
    ? (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(value as Record<string, unknown>);
  const itemCount = entries.length;

  return (
    <div>
      <div
        style={{ paddingLeft: `${level * 20}px` }}
        className="py-1 cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 rounded"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-gray-600 font-bold select-none">{isExpanded ? '▼' : '▶'}</span>
        <span className="font-semibold text-gray-900">{nodeKey}:</span>
        <span className="text-gray-500 text-sm">
          {isArray ? `[${itemCount}]` : `{${itemCount}}`}
        </span>
      </div>
      {isExpanded &&
        entries.map(([key, val]) => (
          <TreeNode
            key={`${currentPath}-${key}`}
            nodeKey={key}
            value={val}
            level={level + 1}
            onEdit={onEdit}
            path={currentPath}
            treeAction={treeAction}
          />
        ))}
    </div>
  );
}

interface JSONTreeViewProps {
  data: unknown;
  onEdit?: (path: string, value: unknown) => void;
}

export default function JSONTreeView({ data, onEdit }: JSONTreeViewProps) {
  const [treeAction, setTreeAction] = useState<TreeAction>({
    mode: 'expand',
    version: 0,
  });

  const updateTreeAction = (mode: TreeAction['mode']) => {
    setTreeAction((current) => ({
      mode,
      version: current.version + 1,
    }));
  };

  if (data === null || typeof data !== 'object') {
    return (
      <div className="p-4 text-gray-600">
        <span className="text-gray-900 font-semibold">Root:</span>
        <span className="ml-2">
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const entries: Array<[string, unknown]> = isArray 
    ? (data as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(data as Record<string, unknown>);

  return (
    <div className="p-4 overflow-auto max-h-130 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-bold">▼</span>
          <span className="font-semibold text-gray-900">Root</span>
          <span className="text-gray-500 text-sm">{isArray ? `[${entries.length}]` : `{${entries.length}}`}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateTreeAction('expand')}
            className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => updateTreeAction('collapse')}
            className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>
      {entries.map(([key, value]) => (
        <TreeNode
          key={`root-${key}`}
          nodeKey={key}
          value={value}
          level={0}
          onEdit={onEdit}
          treeAction={treeAction}
        />
      ))}
    </div>
  );
}
