"use client";

import { useEffect, useRef, useState } from "react";
import JSONInput from "./components/JSONInput";
import JSONViewer from "./components/JSONViewer";
import XMLInput from "./components/XMLInput";
import XMLViewer from "./components/XMLViewer";
import { isValidJSON, parseJSON } from "./utils/jsonValidator";
import {
  isValidXML,
  parseXML,
  formatXML,
  type XMLNode,
} from "./utils/xmlValidator";

export default function Home() {
  const [activeMainTab, setActiveMainTab] = useState<"json" | "xml">("json");
  const outputSectionRef = useRef<HTMLDivElement | null>(null);
  const pendingAutoScrollRef = useRef(false);

  const getMainTabIcon = (tab: "json" | "xml") => {
    if (tab === "json") {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l-3 3 3 3M16 9l3 3-3 3M13 7l-2 10"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h6m-6 4h10"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 6h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z"
        />
      </svg>
    );
  };

  const [jsonInput, setJsonInput] = useState("");
  const [parsedJSONData, setParsedJSONData] = useState<unknown | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [xmlInput, setXmlInput] = useState("");
  const [parsedXMLData, setParsedXMLData] = useState<XMLNode | null>(null);
  const [xmlError, setXmlError] = useState<string | null>(null);

  const scrollToOutputSection = () => {
    outputSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const hasParsedOutput =
      activeMainTab === "json"
        ? parsedJSONData !== null
        : parsedXMLData !== null;

    if (!pendingAutoScrollRef.current || !hasParsedOutput) {
      return;
    }

    pendingAutoScrollRef.current = false;
    requestAnimationFrame(scrollToOutputSection);
  }, [activeMainTab, parsedJSONData, parsedXMLData]);

  const handleValidateJSON = () => {
    setJsonError(null);

    if (!jsonInput.trim()) {
      pendingAutoScrollRef.current = false;
      setJsonError("Please enter JSON data");
      return;
    }

    if (!isValidJSON(jsonInput)) {
      pendingAutoScrollRef.current = false;
      setJsonError("The JSON is invalid.");
      return;
    }

    pendingAutoScrollRef.current = true;
    const data = parseJSON(jsonInput);
    setParsedJSONData(data);
  };

  const handleJSONInputChange = (value: string) => {
    setJsonInput(value);
    setParsedJSONData(null);
    if (jsonError) setJsonError(null);
  };

  const handleJSONDataChange = (updatedData: unknown) => {
    setParsedJSONData(updatedData);
    // Update the input field to reflect changes
    setJsonInput(JSON.stringify(updatedData, null, 2));
  };

  const handleSaveJSONChanges = (updatedData: unknown) => {
    setParsedJSONData(updatedData);
    setJsonInput(JSON.stringify(updatedData, null, 2));
    setJsonError(null);
  };

  const demoJSON = `{"name":"Tom Cat","age":20,"isActive":true,"skills":["JS","React"],"address":{"city":"NYC","zip":10001},"lastLogin":null}
`;
  const handleTryDemoJSON = () => {
    setJsonInput(demoJSON);
    setJsonError(null);

    if (!isValidJSON(demoJSON)) {
      pendingAutoScrollRef.current = false;
      setJsonError("The demo JSON is invalid.");
      setParsedJSONData(null);
      return;
    }

    pendingAutoScrollRef.current = true;
    const data = parseJSON(demoJSON);
    setParsedJSONData(data);
  };

  const demoXML = `<?xml version="1.0" encoding="UTF-8"?><user xmlns:xsi="http://www.w3.org"><name>Tom Cat</name><age>20</age><isActive>true</isActive><skills><skill>JS</skill><skill>React</skill></skills><address><city>NYC</city><zip>10001</zip></address><lastLogin xsi:nil="true"/></user>
`;
  const handleTryDemoXML = () => {
    setXmlInput(demoXML);
    setXmlError(null);

    if (!isValidXML(demoXML)) {
      pendingAutoScrollRef.current = false;
      setXmlError("The demo XML is invalid.");
      setParsedXMLData(null);
      return;
    }

    pendingAutoScrollRef.current = true;
    const data = parseXML(demoXML);
    setParsedXMLData(data);
  };

  const handleValidateXML = () => {
    setXmlError(null);

    if (!xmlInput.trim()) {
      pendingAutoScrollRef.current = false;
      setXmlError("Please enter XML data");
      return;
    }

    if (!isValidXML(xmlInput)) {
      pendingAutoScrollRef.current = false;
      setXmlError("The XML is invalid.");
      return;
    }

    pendingAutoScrollRef.current = true;
    const data = parseXML(xmlInput);
    setParsedXMLData(data);
  };

  const handleXMLInputChange = (value: string) => {
    setXmlInput(value);
    setParsedXMLData(null);
    if (xmlError) setXmlError(null);
  };

  const handleXMLDataChange = (updatedData: XMLNode) => {
    setParsedXMLData(updatedData);
    // Update the input field to reflect changes
    const xmlString = formatXML(updatedData);
    setXmlInput(xmlString);
  };

  const handleSaveXMLChanges = (updatedData: XMLNode) => {
    setParsedXMLData(updatedData);
    const xmlString = formatXML(updatedData);
    setXmlInput(xmlString);
    setXmlError(null);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="p-4 pb-0 md:p-8 md:pb-0">
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

        <div className="hidden md:flex gap-2 border-b border-gray-200 mb-8">
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

        {/* Main Content - Side by Side on Desktop, Stacked on Mobile */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 min-h-[70vh]">
          {/* Left Column - Input */}
          <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col">
            {activeMainTab === "json" ? (
              <JSONInput
                value={jsonInput}
                onChange={handleJSONInputChange}
                onValidate={handleValidateJSON}
                onTryDemo={handleTryDemoJSON}
                canCopy={parsedJSONData !== null}
              />
            ) : (
              <XMLInput
                value={xmlInput}
                onChange={handleXMLInputChange}
                onValidate={handleValidateXML}
                onTryDemo={handleTryDemoXML}
                canCopy={parsedXMLData !== null}
              />
            )}
            {/* Error Message */}
            {activeMainTab === "json" && jsonError && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-medium text-sm">{jsonError}</p>
              </div>
            )}
            {activeMainTab === "xml" && xmlError && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-700 font-medium text-sm">{xmlError}</p>
              </div>
            )}
          </div>

          {/* Right Column - Viewer */}
          <div
            ref={outputSectionRef}
            className="w-full md:w-1/2 scroll-mt-24 bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col flex-1"
          >
            {activeMainTab === "json" ? (
              parsedJSONData === null ? (
                <div className="text-center py-12 text-gray-500 mt-auto mb-auto ">
                  <p className="text-xl">
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
              <div className="text-center py-12 text-gray-500 mt-auto mb-auto ">
                <p className="text-xl">
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-xl border-t border-white/60 z-20 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] supports-[backdrop-filter]:bg-white/35">
        <div className="flex items-center justify-around h-16">
          {(["json", "xml"] as const).map((tab) => {
            const isActive = activeMainTab === tab;
            const label = tab.toUpperCase();

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveMainTab(tab)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
                  isActive ? "text-gray-900" : "text-gray-600"
                }`}
                aria-label={`Switch to ${label}`}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex flex-col items-center transition-transform duration-300 ${
                    isActive ? "scale-105" : ""
                  }`}
                >
                  {getMainTabIcon(tab)}
                  <span className="text-xs mt-1 font-medium">{label}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-gray-900 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
