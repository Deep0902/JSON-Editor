/**
 * Validates if a string is valid JSON
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Safely parses JSON string
 */
export function parseJSON(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

/**
 * Formats JSON string with proper indentation
 */
export function formatJSON(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return "";
  }
}
