"use client";

import { useActionState } from "react";
import { importPhrasesCsv, type CsvImportState } from "./actions";

export default function CsvImport() {
  const [state, formAction, pending] = useActionState<CsvImportState, FormData>(
    importPhrasesCsv,
    null
  );

  return (
    <div className="rounded-xl border border-neutral-800 p-6">
      <h2 className="mb-1 font-medium">Bulk import (CSV)</h2>
      <p className="mb-4 text-xs text-neutral-500">
        One phrase per line, format <code>text,author</code>. Author is optional.
        Wrap text in quotes if it contains a comma. A <code>text,author</code>{" "}
        header row is ignored.
      </p>

      <form action={formAction} className="space-y-3">
        <textarea
          name="csv"
          required
          rows={6}
          placeholder={'"Keep going, you\'re doing great",Anon\nYou matter'}
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-mono text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {pending ? "Importing…" : "Import"}
        </button>
      </form>

      {state && (
        <div className="mt-4 space-y-2 text-sm">
          {state.added > 0 && (
            <p className="text-emerald-500">
              Added {state.added} phrase{state.added === 1 ? "" : "s"} to the queue.
            </p>
          )}
          {state.errors.length > 0 && (
            <div className="text-amber-500">
              <p>{state.errors.length} row(s) skipped:</p>
              <ul className="mt-1 list-inside list-disc text-amber-400/80">
                {state.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
