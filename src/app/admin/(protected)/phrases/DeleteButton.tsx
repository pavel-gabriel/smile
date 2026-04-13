"use client";

import { deletePhrase } from "./actions";

export default function DeleteButton({ phraseId }: { phraseId: string }) {
  async function handleDelete() {
    if (!confirm("Delete this phrase?")) return;
    await deletePhrase(phraseId);
  }

  return (
    <button
      onClick={handleDelete}
      title="Delete"
      className="text-neutral-600 transition hover:text-red-400"
    >
      ✕
    </button>
  );
}
