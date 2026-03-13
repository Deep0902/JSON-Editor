export interface XMLNode {
  tag: string;
  attributes: Record<string, string>;
  text: string;
  children: XMLNode[];
}

function escapeXML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function hasParserError(document: Document): boolean {
  return document.getElementsByTagName('parsererror').length > 0;
}

function parseXMLToDocument(xmlString: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
}

function elementToNode(element: Element): XMLNode {
  const attributes: Record<string, string> = {};
  for (const attribute of Array.from(element.attributes)) {
    attributes[attribute.name] = attribute.value;
  }

  const children = Array.from(element.children).map((child) => elementToNode(child));
  const text = Array.from(element.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent?.trim() ?? '')
    .join(' ')
    .trim();

  return {
    tag: element.tagName,
    attributes,
    text,
    children,
  };
}

function nodeToXMLString(node: XMLNode, level = 0): string {
  const indent = '  '.repeat(level);
  const attributeEntries = Object.entries(node.attributes);
  const attributes = attributeEntries.length
    ? ` ${attributeEntries
        .map(([key, value]) => `${key}=\"${escapeXML(value)}\"`)
        .join(' ')}`
    : '';

  const hasChildren = node.children.length > 0;
  const hasText = node.text.trim().length > 0;

  if (!hasChildren && !hasText) {
    return `${indent}<${node.tag}${attributes} />`;
  }

  if (!hasChildren && hasText) {
    return `${indent}<${node.tag}${attributes}>${escapeXML(node.text)}</${node.tag}>`;
  }

  const childLines = node.children.map((child) => nodeToXMLString(child, level + 1));
  const textLine = hasText ? `${'  '.repeat(level + 1)}${escapeXML(node.text)}` : null;
  const contentLines = textLine ? [textLine, ...childLines] : childLines;

  return `${indent}<${node.tag}${attributes}>\n${contentLines.join('\n')}\n${indent}</${node.tag}>`;
}

export function isValidXML(xmlString: string): boolean {
  try {
    if (!xmlString.trim()) {
      return false;
    }

    const xmlDocument = parseXMLToDocument(xmlString);
    if (hasParserError(xmlDocument)) {
      return false;
    }

    return Boolean(xmlDocument.documentElement?.tagName);
  } catch {
    return false;
  }
}

export function parseXML(xmlString: string): XMLNode | null {
  try {
    const xmlDocument = parseXMLToDocument(xmlString);
    if (hasParserError(xmlDocument)) {
      return null;
    }

    const rootElement = xmlDocument.documentElement;
    if (!rootElement) {
      return null;
    }

    return elementToNode(rootElement);
  } catch {
    return null;
  }
}

export function formatXML(xmlInput: string | XMLNode): string {
  try {
    if (typeof xmlInput === 'string') {
      const parsed = parseXML(xmlInput);
      if (!parsed) {
        return '';
      }
      return nodeToXMLString(parsed);
    }

    return nodeToXMLString(xmlInput);
  } catch {
    return '';
  }
}
