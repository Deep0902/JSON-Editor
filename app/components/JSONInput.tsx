"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface JSONInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
  onTryDemo: () => void;
  canCopy: boolean;
}

export default function JSONInput({
  value,
  onChange,
  onValidate,
  onTryDemo,
  canCopy,
}: JSONInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <label className="text-sm font-semibold text-gray-900">
        Paste Your JSON Data
      </label>
      <div className="flex-1 border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[json()]}
          height="100%"
          theme="light"
          className="text-sm h-full"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            highlightSelectionMatches: true,
            searchKeymap: true,
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onValidate}
          className="px-3 py-2 text-sm sm:text-base sm:px-6 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 w-fit whitespace-nowrap"
        >
          Validate & Parse JSON
        </button>
        {canCopy && (
          <button
            onClick={handleCopy}
            className={`px-3 py-2 text-sm sm:text-base sm:px-6 font-semibold rounded-lg transition-colors duration-200 cursor-pointer whitespace-nowrap ${
              copied
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
            type="button"
          >
            {copied ? "Copied" : "Copy to Clipboard"}
          </button>
        )}
        <button
          onClick={onTryDemo}
          className="px-3 py-2 text-sm sm:text-base sm:px-6 font-semibold rounded-lg border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 cursor-pointer whitespace-nowrap"
          type="button"
        >
          Try a demo!
        </button>
      </div>
    </div>
  );
}
