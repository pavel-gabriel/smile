// Pure CSV parsing for bulk phrase import. No I/O — safe to unit test.
// Expected format per row: text,author  (author optional)
// Supports quoted fields so phrases may contain commas: "Hello, world",Anon

export type ParsedPhrase = { text: string; author: string | null };
export type CsvParseResult = {
  rows: ParsedPhrase[];
  errors: string[];
};

// Splits a single CSV line into fields, honoring double-quoted segments
// and escaped quotes ("").
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

// Parses CSV text into phrase rows. Invalid rows are reported in `errors`
// (1-based line numbers) and skipped; valid rows are returned in order.
export function parsePhrasesCsv(input: string): CsvParseResult {
  const rows: ParsedPhrase[] = [];
  const errors: string[] = [];

  const lines = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  lines.forEach((rawLine, idx) => {
    const lineNumber = idx + 1;
    const line = rawLine.trim();

    // Skip blank lines silently.
    if (line === "") return;

    // Skip a header row like "text,author" (only on the first line).
    if (idx === 0) {
      const lower = line.toLowerCase();
      if (lower === "text,author" || lower === "text" || lower === '"text","author"') {
        return;
      }
    }

    const fields = splitCsvLine(rawLine);
    const text = (fields[0] ?? "").trim();
    const author = (fields[1] ?? "").trim();

    if (text === "") {
      errors.push(`Line ${lineNumber}: missing phrase text`);
      return;
    }

    rows.push({ text, author: author === "" ? null : author });
  });

  return { rows, errors };
}
