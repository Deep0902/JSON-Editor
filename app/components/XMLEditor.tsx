'use client';

import { useEffect, useState } from 'react';
import { formatXML, parseXML, type XMLNode } from '../utils/xmlValidator';

interface XMLEditorProps {
  initialData: XMLNode;
  onSave?: (data: XMLNode) => void;
}

export default function XMLEditor({ initialData, onSave }: XMLEditorProps) {
  const [editorContent, setEditorContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEditorContent(formatXML(initialData));
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
    const parsed = parseXML(editorContent);
    if (!parsed) {
      alert('Invalid XML in editor');
      return;
    }

    onSave?.(parsed);
  };

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="xml-editor" className="text-sm font-semibold text-gray-900">
        Editable XML Output
      </label>

      <textarea
        id="xml-editor"
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400 font-mono text-sm resize-vertical"
      />

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className={`px-6 py-2 font-semibold rounded-lg transition-colors duration-200 ${
            copied ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
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
