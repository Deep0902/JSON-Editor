'use client';

import { useState, useEffect } from 'react';
import { formatJSON } from '../utils/jsonValidator';

interface JSONEditorProps {
  initialData: unknown;
  onSave?: (data: unknown) => void;
}

export default function JSONEditor({ initialData, onSave }: JSONEditorProps) {
  const [editorContent, setEditorContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditorContent(formatJSON(initialData));
  }, [initialData]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editorContent);
      onSave?.(parsed);
    } catch (error) {
      alert('Invalid JSON in editor');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="json-editor" className="text-sm font-semibold text-gray-900">
        Editable JSON Output
      </label>
      
      <textarea
        id="json-editor"
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400 font-mono text-sm resize-vertical"
      />
      
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors duration-200 ${
            copied
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          {copied ? '✓ Copied' : 'Copy to Clipboard'}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
