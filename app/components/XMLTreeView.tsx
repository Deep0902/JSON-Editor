'use client';

import { useState } from 'react';
import { type XMLNode } from '../utils/xmlValidator';

interface XMLTreeViewProps {
  data: XMLNode;
  onEdit?: (path: string, value: string) => void;
}

interface TreeNodeProps {
  node: XMLNode;
  path: string;
  level: number;
  onEdit?: (path: string, value: string) => void;
}

function TreeNode({ node, path, level, onEdit }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const beginEdit = (targetPath: string, value: string) => {
    setEditingPath(targetPath);
    setEditValue(value);
  };

  const saveEdit = (targetPath: string) => {
    onEdit?.(targetPath, editValue);
    setEditingPath(null);
  };

  return (
    <div>
      <div
        style={{ paddingLeft: `${level * 20}px` }}
        className="py-1 cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-2 rounded"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="text-gray-600 font-bold select-none">{isExpanded ? '▼' : '▶'}</span>
        <span className="font-semibold text-gray-900">&lt;{node.tag}&gt;</span>
        <span className="text-gray-500 text-sm">children: {node.children.length}</span>
      </div>

      {isExpanded && (
        <div>
          {Object.entries(node.attributes).map(([key, value]) => {
            const attributePath = `${path}.attributes.${key}`;
            return (
              <div
                key={attributePath}
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                className="py-1 text-sm"
              >
                <span className="font-semibold text-blue-700">@{key}:</span>
                {editingPath === attributePath ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(attributePath)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(attributePath);
                      if (e.key === 'Escape') setEditingPath(null);
                    }}
                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ) : (
                  <span
                    onClick={() => beginEdit(attributePath, value)}
                    className="ml-2 text-blue-600 cursor-pointer hover:bg-blue-50 px-1 rounded"
                  >
                    {value}
                  </span>
                )}
              </div>
            );
          })}

          <div style={{ paddingLeft: `${(level + 1) * 20}px` }} className="py-1 text-sm">
            <span className="font-semibold text-green-700">#text:</span>
            {editingPath === `${path}.text` ? (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(`${path}.text`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(`${path}.text`);
                  if (e.key === 'Escape') setEditingPath(null);
                }}
                className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <span
                onClick={() => beginEdit(`${path}.text`, node.text)}
                className="ml-2 text-green-700 cursor-pointer hover:bg-green-50 px-1 rounded"
              >
                {node.text || '(empty)'}
              </span>
            )}
          </div>

          {node.children.map((child, index) => (
            <TreeNode
              key={`${path}.children.${index}`}
              node={child}
              path={`${path}.children.${index}`}
              level={level + 1}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function XMLTreeView({ data, onEdit }: XMLTreeViewProps) {
  return (
    <div className="p-4 overflow-auto max-h-130 bg-white border border-gray-200 rounded-lg">
      <TreeNode node={data} path="root" level={0} onEdit={onEdit} />
    </div>
  );
}
