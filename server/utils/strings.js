export function kebabCase(str) {
  if (!str) {
    return str;
  }

  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleCase(str) {
  if (!str) {
    return str;
  }

  str = str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function removeCodeBlock(str) {
  if (typeof str != "string") {
    return str;
  }
  const jsonRegex = /^```json\n([\s\S]*)\n```$/;
  const match = str.match(jsonRegex);
  return match ? match[1] : str;
}
