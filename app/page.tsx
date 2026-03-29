"use client";

import { useState } from "react";
import JSONInput from "./components/JSONInput";
import JSONViewer from "./components/JSONViewer";
import JSONEditor from "./components/JSONEditor";
import XMLInput from "./components/XMLInput";
import XMLViewer from "./components/XMLViewer";
import XMLEditor from "./components/XMLEditor";
import { isValidJSON, parseJSON } from "./utils/jsonValidator";
import { isValidXML, parseXML, type XMLNode } from "./utils/xmlValidator";

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<"json" | "xml">("json");

  const [jsonInput, setJsonInput] = useState("");
  const [parsedJSONData, setParsedJSONData] = useState<unknown | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [xmlInput, setXmlInput] = useState("");
  const [parsedXMLData, setParsedXMLData] = useState<XMLNode | null>(null);
  const [xmlError, setXmlError] = useState<string | null>(null);

  const handleValidateJSON = () => {
    setJsonError(null);

    if (!jsonInput.trim()) {
      setJsonError("Please enter JSON data");
      return;
    }

    if (!isValidJSON(jsonInput)) {
      setJsonError("The JSON is invalid.");
      alert("The JSON is invalid.");
      return;
    }

    const data = parseJSON(jsonInput);
    setParsedJSONData(data);
  };

  const handleJSONInputChange = (value: string) => {
    setJsonInput(value);
    if (jsonError) setJsonError(null);
  };

  const handleJSONDataChange = (updatedData: unknown) => {
    setParsedJSONData(updatedData);
  };

  const handleSaveJSONChanges = (updatedData: unknown) => {
    setParsedJSONData(updatedData);
    setJsonError(null);
  };

  const demoJSON =
    '{"name":"Tom Cat", "friendName": "Jerry Mouse", "age":20,"city":"New York","skills":["JavaScript","React","Node.js", "Angular"]}';

  const handleTryDemoJSON = () => {
    setJsonInput(demoJSON);
    setJsonError(null);

    if (!isValidJSON(demoJSON)) {
      setJsonError("The demo JSON is invalid.");
      setParsedJSONData(null);
      return;
    }

    const data = parseJSON(demoJSON);
    setParsedJSONData(data);
  };

  const demoXML = `<?xml version="1.0" encoding="UTF-8"?>
<book>
    <name>A Song of Ice and Fire</name>
    <author>George R. R. Martin</author>
    <language>English</language>
    <genre>Epic fantasy</genre>
</book>
`;
  const handleTryDemoXML = () => {
    setXmlInput(demoXML);
    setXmlError(null);

    if (!isValidXML(demoXML)) {
      setXmlError("The demo XML is invalid.");
      setParsedXMLData(null);
      return;
    }

    const data = parseXML(demoXML);
    setParsedXMLData(data);
  };

  const handleValidateXML = () => {
    setXmlError(null);

    if (!xmlInput.trim()) {
      setXmlError("Please enter XML data");
      return;
    }

    if (!isValidXML(xmlInput)) {
      setXmlError("The XML is invalid.");
      alert("The XML is invalid.");
      return;
    }

    const data = parseXML(xmlInput);
    setParsedXMLData(data);
  };

  const handleXMLInputChange = (value: string) => {
    setXmlInput(value);
    if (xmlError) setXmlError(null);
  };

  const handleXMLDataChange = (updatedData: XMLNode) => {
    setParsedXMLData(updatedData);
  };

  const handleSaveXMLChanges = (updatedData: XMLNode) => {
    setParsedXMLData(updatedData);
    setXmlError(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="px-12 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            JSON & XML Editor
          </h1>
          <p className="text-gray-600">
            Paste your data, validate it, and view it in multiple formats with
            editing capabilities.
          </p>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveMainTab("json")}
            className={`px-4 py-2 font-semibold transition-colors duration-200 cursor-pointer ${
              activeMainTab === "json"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            JSON
          </button>
          <button
            onClick={() => setActiveMainTab("xml")}
            className={`px-4 py-2 font-semibold transition-colors duration-200 cursor-pointer ${
              activeMainTab === "xml"
                ? "border-b-2 border-gray-900 text-gray-900"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            XML
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-8 mb-8">
          {/* Left Column - Input */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            {activeMainTab === "json" ? (
              <JSONInput
                value={jsonInput}
                onChange={handleJSONInputChange}
                onValidate={handleValidateJSON}
                onTryDemo={handleTryDemoJSON}
              />
            ) : (
              <XMLInput
                value={xmlInput}
                onChange={handleXMLInputChange}
                onValidate={handleValidateXML}
                onTryDemo={handleTryDemoXML}
              />
            )}
          </div>

          {/* Right Column - Viewer */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            {activeMainTab === "json" ? (
              parsedJSONData === null ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">
                    Paste JSON and click &quot;Validate & Parse JSON&quot; to
                    view the data
                  </p>
                </div>
              ) : (
                <JSONViewer
                  data={parsedJSONData}
                  onDataChange={handleJSONDataChange}
                />
              )
            ) : parsedXMLData === null ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">
                  Paste XML and click &quot;Validate & Parse XML&quot; to view
                  the data
                </p>
              </div>
            ) : (
              <XMLViewer
                data={parsedXMLData}
                onDataChange={handleXMLDataChange}
              />
            )}
          </div>
        </div>

        {/* Error Message */}
        {activeMainTab === "json" && jsonError && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{jsonError}</p>
          </div>
        )}
        {activeMainTab === "xml" && xmlError && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{xmlError}</p>
          </div>
        )}

        {/* Editor Section - Full Width */}
        {activeMainTab === "json" && parsedJSONData !== null && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <JSONEditor
              initialData={parsedJSONData}
              onSave={handleSaveJSONChanges}
            />
          </div>
        )}
        {activeMainTab === "xml" && parsedXMLData !== null && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <XMLEditor
              initialData={parsedXMLData}
              onSave={handleSaveXMLChanges}
            />
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">✓ Validation</h3>
            <p className="text-sm text-gray-600">
              Automatically validates JSON or XML format and alerts if invalid
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              🔐 Privacy First
            </h3>
            <p className="text-sm text-gray-600">
              Data never leaves your machine!
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">✎ Full Editing</h3>
            <p className="text-sm text-gray-600">
              Edit structured data and switch between tree and table views
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
