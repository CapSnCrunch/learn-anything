export function kebabCase(str) {
  if (!str) {
    return str;
  }

  return str
    .trim() // Remove leading and trailing whitespaces
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, "") // Remove non-alphanumeric characters except hyphens
    .replace(/-{2,}/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function removeCodeBlock(str) {
  const jsonRegex = /^```json\n([\s\S]*)\n```$/;
  const match = str.match(jsonRegex);
  return match ? match[1] : str;
}
