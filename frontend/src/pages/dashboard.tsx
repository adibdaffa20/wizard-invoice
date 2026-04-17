import Link from "next/link";
import { useRouter } from "next/router";
import ProtectedLayout from "@/components/layout/protected-layout";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    logout();
    await router.replace("/login");
  }

  return (
    <ProtectedLayout>
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-500">
                Login sebagai <span className="font-semibold uppercase">{role}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Buat Invoice</h2>
              <p className="mt-2 text-sm text-slate-500">
                Masuk ke wizard untuk input data klien, data barang, lalu submit invoice.
              </p>
              <Link
                href="/wizard"
                className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white"
              >
                Buka Wizard
              </Link>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Catatan Requirement</h2>
              <ul className="mt-2 space-y-2 text-sm text-slate-500">
                <li>- Zustand persist untuk state wizard</li>
                <li>- Debounce 500ms + AbortController</li>
                <li>- Role-based payload Admin vs Kerani</li>
                <li>- JWT via Axios interceptor</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  );
}