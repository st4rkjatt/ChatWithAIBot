import { aliasMap } from "./aliasMap";
import { fuzzyFindUser } from "./fuzzyMatch";

export function resolveUserName(inputName: string): string | null {
  const cleaned = inputName.trim().toLowerCase();

  // Step 1: Fast exact alias match
  console.log(`Exact match found for: ${aliasMap[cleaned]}`);
  if (aliasMap[cleaned]) {
    console.log(`Exact match found for: ${cleaned}`);
    return aliasMap[cleaned];
  }

  // Step 2: Fuzzy fallback
  return fuzzyFindUser(cleaned);
}
