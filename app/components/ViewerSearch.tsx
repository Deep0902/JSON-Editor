"use client";

import { useEffect, useRef } from "react";

interface SearchToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  matchCount: number;
  placeholder: string;
}

interface HighlightedTextProps {
  text: string;
  query: string;
  emptyFallback?: string;
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function matchesSearch(
  query: string,
  ...values: Array<unknown>
): boolean {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return false;
  }

  return values.some((value) =>
    String(value ?? "")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function HighlightedText({
  text,
  query,
  emptyFallback,
}: HighlightedTextProps) {
  const content = text || emptyFallback || "";
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery || !content) {
    return <>{content}</>;
  }

  const lowercaseContent = content.toLowerCase();
  const parts: Array<{ text: string; matched: boolean }> = [];
  let cursor = 0;

  while (cursor < content.length) {
    const nextMatchIndex = lowercaseContent.indexOf(normalizedQuery, cursor);

    if (nextMatchIndex === -1) {
      parts.push({ text: content.slice(cursor), matched: false });
      break;
    }

    if (nextMatchIndex > cursor) {
      parts.push({
        text: content.slice(cursor, nextMatchIndex),
        matched: false,
      });
    }

    parts.push({
      text: content.slice(
        nextMatchIndex,
        nextMatchIndex + normalizedQuery.length,
      ),
      matched: true,
    });

    cursor = nextMatchIndex + normalizedQuery.length;
  }

  return (
    <>
      {parts.map((part, index) =>
        part.matched ? (
          <mark
            key={`${part.text}-${index}`}
            className="search-highlight-glow rounded bg-amber-200/80 px-0.5 text-inherit"
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

export default function SearchToolbar({
  query,
  onQueryChange,
  matchCount,
  placeholder,
}: SearchToolbarProps) {
  const hasQuery = query.trim().length > 0;
  const inputref = useRef<any>(null);

  useEffect(() => {
    inputref.current.focus();
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="search"
          ref={inputref}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="search-input-no-clear w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400 px-3 py-2 text-sm text-gray-900 outline-none transition"
        />
        <div className="flex items-center gap-2">
          {hasQuery && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="px-6 py-2 font-semibold text-sm rounded-lg transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer"
              //   className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 h-full"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      {hasQuery && (
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 whitespace-nowrap w-fit">
          {matchCount} {matchCount === 1 ? "match" : "matches"} found
        </span>
      )}
      <p className="text-xs text-gray-500">
        Highlights matches across labels, values, and paths while keeping the
        full structure visible.
      </p>
    </div>
  );
}
