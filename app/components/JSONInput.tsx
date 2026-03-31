"use client";

import { useEffect, useRef } from "react";

interface JSONInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
  onTryDemo: () => void;
}

export default function JSONInput({
  value,
  onChange,
  onValidate,
  onTryDemo,
}: JSONInputProps) {
  const inputref = useRef<any>(null);
  useEffect(() => {
    inputref.current.focus();
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="json-input"
        className="text-sm font-semibold text-gray-900"
      >
        Paste Your JSON Data
      </label>
      <textarea
        id="json-input"
        ref={inputref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your JSON data here..."
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400 font-mono text-sm resize-vertical"
      />
      <div className="flex gap-2">
        <button
          onClick={onValidate}
          className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 w-fit"
        >
          Validate & Parse JSON
        </button>
        <button
          onClick={onTryDemo}
          // className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200 w-fit border border-gray-300 cursor-pointer"
          className="px-6 py-2 font-semibold rounded-lg transition-colors duration-200 bg-gray-200 text-gray-900 hover:bg-gray-300 cursor-pointer"
          type="button"
        >
          Try a demo!
        </button>
      </div>
    </div>
  );
}
