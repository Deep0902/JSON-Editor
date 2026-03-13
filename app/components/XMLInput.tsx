'use client';

interface XMLInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidate: () => void;
}

export default function XMLInput({ value, onChange, onValidate }: XMLInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="xml-input" className="text-sm font-semibold text-gray-900">
        Paste Your XML Data
      </label>
      <textarea
        id="xml-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your XML data here..."
        className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-400 font-mono text-sm resize-vertical"
      />
      <button
        onClick={onValidate}
        className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 w-fit"
      >
        Validate & Parse XML
      </button>
    </div>
  );
}
