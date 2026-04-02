"use client";

import { useEffect, useMemo, useState } from "react";
import { type XMLNode } from "../utils/xmlValidator";
import {
  HighlightedText,
  matchesSearch,
  normalizeSearchQuery,
} from "./ViewerSearch";

interface TreeAction {
  mode: "expand" | "collapse";
  version: number;
}

interface XMLTreeViewProps {
  data: XMLNode;
  onEdit?: (path: string, value: string) => void;
  searchQuery?: string;
}

interface TreeNodeProps {
  node: XMLNode;
  path: string;
  level: number;
  onEdit?: (path: string, value: string) => void;
  treeAction: TreeAction;
  searchQuery: string;
  matchedPaths: Set<string>;
  expandedPaths: Set<string>;
  matchedAttributePaths: Set<string>;
  matchedTextPaths: Set<string>;
}

function TreeNode({
  node,
  path,
  level,
  onEdit,
  treeAction,
  searchQuery,
  matchedPaths,
  expandedPaths,
  matchedAttributePaths,
  matchedTextPaths,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const hasSearchQuery = normalizeSearchQuery(searchQuery).length > 0;
  const isMatched = matchedPaths.has(path);
  const shouldForceExpand = hasSearchQuery && expandedPaths.has(path);
  const showChildren = shouldForceExpand || isExpanded;

  useEffect(() => {
    setIsExpanded(treeAction.mode === "expand");
  }, [treeAction]);

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
        className={`py-1 cursor-pointer flex items-center gap-2 text-gray-700 px-2 rounded ${
          isMatched ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-100"
        }`}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span className="text-gray-600 font-bold select-none">
          {showChildren ? "▼" : "▶"}
        </span>
        <span className="font-semibold text-gray-900">
          &lt;<HighlightedText text={node.tag} query={searchQuery} />&gt;
        </span>
        <span className="text-gray-500 text-sm">
          children: {node.children.length}
        </span>
      </div>

      {showChildren && (
        <div>
          {Object.entries(node.attributes).map(([key, value]) => {
            const attributePath = `${path}.attributes.${key}`;
            const isAttributeMatched = matchedAttributePaths.has(attributePath);
            return (
              <div
                key={attributePath}
                style={{ paddingLeft: `${(level + 1) * 20}px` }}
                className={`py-1 text-sm rounded ${isAttributeMatched ? "bg-amber-50" : ""}`}
              >
                <span className="font-semibold text-blue-700">
                  @<HighlightedText text={key} query={searchQuery} />:
                </span>
                {editingPath === attributePath ? (
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(attributePath)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(attributePath);
                      if (e.key === "Escape") setEditingPath(null);
                    }}
                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                ) : (
                  <span
                    onClick={() => beginEdit(attributePath, value)}
                    className="ml-2 text-blue-600 cursor-pointer hover:bg-blue-50 px-1 rounded"
                  >
                    <HighlightedText text={value} query={searchQuery} />
                  </span>
                )}
              </div>
            );
          })}

          <div
            style={{ paddingLeft: `${(level + 1) * 20}px` }}
            className={`py-1 text-sm rounded ${matchedTextPaths.has(`${path}.text`) ? "bg-amber-50" : ""}`}
          >
            <span className="font-semibold text-green-700">#text:</span>
            {editingPath === `${path}.text` ? (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(`${path}.text`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(`${path}.text`);
                  if (e.key === "Escape") setEditingPath(null);
                }}
                className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            ) : (
              <span
                onClick={() => beginEdit(`${path}.text`, node.text)}
                className="ml-2 text-green-700 cursor-pointer hover:bg-green-50 px-1 rounded"
              >
                <HighlightedText
                  text={node.text}
                  query={searchQuery}
                  emptyFallback="(empty)"
                />
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
              treeAction={treeAction}
              searchQuery={searchQuery}
              matchedPaths={matchedPaths}
              expandedPaths={expandedPaths}
              matchedAttributePaths={matchedAttributePaths}
              matchedTextPaths={matchedTextPaths}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function collectSearchPaths(data: XMLNode, searchQuery: string) {
  const matchedPaths = new Set<string>();
  const expandedPaths = new Set<string>();
  const matchedAttributePaths = new Set<string>();
  const matchedTextPaths = new Set<string>();
  const normalizedQuery = normalizeSearchQuery(searchQuery);

  if (!normalizedQuery) {
    return {
      matchedPaths,
      expandedPaths,
      matchedAttributePaths,
      matchedTextPaths,
    };
  }

  const visit = (node: XMLNode, path: string, displayPath: string): boolean => {
    const nodeMatched = matchesSearch(searchQuery, node.tag, displayPath, `<${node.tag}>`);

    if (nodeMatched) {
      matchedPaths.add(path);
    }

    const attributeMatched = Object.entries(node.attributes).some(([key, value]) => {
      const attributePath = `${path}.attributes.${key}`;
      const attributeDisplayPath = `${displayPath}/@${key}`;
      const isMatched = matchesSearch(
        searchQuery,
        key,
        value,
        attributeDisplayPath,
      );

      if (isMatched) {
        matchedAttributePaths.add(attributePath);
      }

      return isMatched;
    });

    const textPath = `${path}.text`;
    const textMatched = matchesSearch(searchQuery, node.text, `${displayPath}/text()`);

    if (textMatched) {
      matchedTextPaths.add(textPath);
    }

    const childMatched = node.children.some((child, index) =>
      visit(child, `${path}.children.${index}`, `${displayPath}/${child.tag}[${index}]`),
    );

    if (nodeMatched || attributeMatched || textMatched || childMatched) {
      expandedPaths.add(path);
    }

    return nodeMatched || attributeMatched || textMatched || childMatched;
  };

  visit(data, "root", `/${data.tag}`);

  return {
    matchedPaths,
    expandedPaths,
    matchedAttributePaths,
    matchedTextPaths,
  };
}

export default function XMLTreeView({
  data,
  onEdit,
  searchQuery = "",
}: XMLTreeViewProps) {
  const [treeAction, setTreeAction] = useState<TreeAction>({
    mode: "expand",
    version: 0,
  });
  const {
    matchedPaths,
    expandedPaths,
    matchedAttributePaths,
    matchedTextPaths,
  } = useMemo(() => collectSearchPaths(data, searchQuery), [data, searchQuery]);

  const updateTreeAction = (mode: TreeAction["mode"]) => {
    setTreeAction((current) => ({
      mode,
      version: current.version + 1,
    }));
  };

  return (
    <div className="p-4 overflow-auto max-h-[inherit] bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <span className="text-md font-medium">Tree View</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateTreeAction("expand")}
            className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => updateTreeAction("collapse")}
            className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>
      <TreeNode
        node={data}
        path="root"
        level={0}
        onEdit={onEdit}
        treeAction={treeAction}
        searchQuery={searchQuery}
        matchedPaths={matchedPaths}
        expandedPaths={expandedPaths}
        matchedAttributePaths={matchedAttributePaths}
        matchedTextPaths={matchedTextPaths}
      />
    </div>
  );
}
