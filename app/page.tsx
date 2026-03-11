'use client';

import { useState } from 'react';
import JSONInput from './components/JSONInput';
import JSONViewer from './components/JSONViewer';
import JSONEditor from './components/JSONEditor';
import { isValidJSON, parseJSON } from './utils/jsonValidator';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedData, setParsedData] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = () => {
    setError(null);

    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    if (!isValidJSON(jsonInput)) {
      setError('The JSON is invalid.');
      alert('The JSON is invalid.');
      return;
    }

    const data = parseJSON(jsonInput);
    setParsedData(data);
  };

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    if (error) setError(null);
  };

  const handleDataChange = (updatedData: unknown) => {
    setParsedData(updatedData);
  };

  const handleSaveChanges = (updatedData: unknown) => {
    setParsedData(updatedData);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">JSON Editor</h1>
          <p className="text-gray-600">
            Paste your JSON data, validate it, and view it in multiple formats with editing capabilities.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-8 mb-8">
          {/* Left Column - Input */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <JSONInput
              value={jsonInput}
              onChange={handleInputChange}
              onValidate={handleValidate}
            />
          </div>

          {/* Right Column - Viewer */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            {parsedData === null ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">Paste JSON and click "Validate & Parse JSON" to view the data</p>
              </div>
            ) : (
              <JSONViewer data={parsedData} onDataChange={handleDataChange} />
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Editor Section - Full Width */}
        {parsedData !== null && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <JSONEditor initialData={parsedData} onSave={handleSaveChanges} />
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">✓ Validation</h3>
            <p className="text-sm text-gray-600">
              Automatically validates JSON format and alerts if invalid
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Multiple Views</h3>
            <p className="text-sm text-gray-600">
              Switch between tree and table views for better data exploration
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">✎ Full Editing</h3>
            <p className="text-sm text-gray-600">
              Edit JSON data directly and copy the formatted output easily
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
