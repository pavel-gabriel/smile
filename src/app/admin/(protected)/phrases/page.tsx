import { supabaseAdmin } from "@/lib/supabase";
import { addPhrase, deletePhrase, movePhraseUp, movePhraseDown } from "./actions";

export const dynamic = "force-dynamic";

export default async function PhrasesPage() {
  const { data: phrases } = await supabaseAdmin
    .from("phrases")
    .select("id, text, author, queue_position, used_at")
    .order("used_at", { ascending: false, nullsFirst: false })
    .order("queue_position", { ascending: true });

  const total = phrases?.length ?? 0;
  const unused = phrases?.filter((p) => !p.used_at).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Phrases</h1>
        <span className="text-sm text-neutral-400">
          {unused} queued · {total - unused} used · {total} total
        </span>
      </div>

      {!phrases?.length ? (
        <p className="text-neutral-500">No phrases yet. Add one below.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-neutral-500">
                <th className="px-4 py-3 font-normal">#</th>
                <th className="px-4 py-3 font-normal">Phrase</th>
                <th className="px-4 py-3 font-normal">Author</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {phrases.map((phrase, idx) => {
                const isUsed = !!phrase.used_at;
                return (
                  <tr key={phrase.id} className="group">
                    <td className="px-4 py-3 text-neutral-500">
                      {isUsed ? "—" : idx + 1 - (total - unused) + unused}
                    </td>
                    <td className="max-w-md px-4 py-3">
                      <span className="line-clamp-2">{phrase.text}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {phrase.author ?? <span className="text-neutral-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isUsed ? (
                        <span className="text-neutral-500">used</span>
                      ) : (
                        <span className="text-emerald-500">queued</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!isUsed && (
                          <>
                            <form action={movePhraseUp.bind(null, phrase.id)}>
                              <button
                                type="submit"
                                title="Move up"
                                className="text-neutral-500 transition hover:text-white"
                              >
                                ↑
                              </button>
                            </form>
                            <form action={movePhraseDown.bind(null, phrase.id)}>
                              <button
                                type="submit"
                                title="Move down"
                                className="text-neutral-500 transition hover:text-white"
                              >
                                ↓
                              </button>
                            </form>
                          </>
                        )}
                        <form
                          action={deletePhrase.bind(null, phrase.id)}
                          onSubmit={(e) => {
                            if (!confirm("Delete this phrase?")) e.preventDefault();
                          }}
                        >
                          <button
                            type="submit"
                            title="Delete"
                            className="text-neutral-600 transition hover:text-red-400"
                          >
                            ✕
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add single phrase */}
      <div className="rounded-xl border border-neutral-800 p-6">
        <h2 className="mb-4 font-medium">Add phrase</h2>
        <form action={addPhrase} className="space-y-3">
          <textarea
            name="text"
            required
            rows={3}
            placeholder="Enter the phrase…"
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
          />
          <div className="flex gap-3">
            <input
              name="author"
              type="text"
              placeholder="Author (optional)"
              className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
