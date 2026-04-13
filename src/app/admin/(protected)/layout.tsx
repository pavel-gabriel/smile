import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <nav className="flex items-center gap-6">
          <span className="font-semibold tracking-tight">smile</span>
          <Link href="/admin" className="text-sm text-neutral-400 transition hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/phrases" className="text-sm text-neutral-400 transition hover:text-white">
            Phrases
          </Link>
          <Link href="/admin/settings" className="text-sm text-neutral-400 transition hover:text-white">
            Settings
          </Link>
        </nav>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
