import { supabaseAdmin } from "@/lib/supabase";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const revalidate = 60;

type Phrase = {
  text: string;
  author: string | null;
  background_url: string | null;
};

async function getTodaysPhrase(): Promise<Phrase | null> {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabaseAdmin
    .from("daily_selections")
    .select("phrases(text, author, background_url)")
    .eq("date", today)
    .single();

  return (data?.phrases as unknown as Phrase) ?? null;
}

export default async function Home() {
  const phrase = await getTodaysPhrase();
  const bg = phrase?.background_url ?? null;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      {bg ? (
        <>
          <Image
            src={bg}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-neutral-900 to-slate-900" />
      )}

      {/* Phrase */}
      <div className="relative z-10 mx-auto max-w-2xl px-8 text-center text-white">
        {phrase ? (
          <>
            <p
              className={`${playfair.className} text-3xl italic leading-relaxed md:text-5xl`}
            >
              &ldquo;{phrase.text}&rdquo;
            </p>
            {phrase.author && (
              <p className="mt-6 text-sm uppercase tracking-widest opacity-60">
                — {phrase.author}
              </p>
            )}
          </>
        ) : (
          <p
            className={`${playfair.className} text-3xl italic opacity-50`}
          >
            Something beautiful is coming.
          </p>
        )}
      </div>

      {/* Unsplash attribution — required by API terms */}
      {bg && (
        <p className="absolute bottom-4 right-4 text-xs text-white/30">
          Photo via Unsplash
        </p>
      )}
    </main>
  );
}
