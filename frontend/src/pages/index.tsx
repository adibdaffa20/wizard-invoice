import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Invoice Wizard App</h1>
        <p className="mt-3 text-slate-600">
          Aplikasi multi-step untuk mencatat resi pengiriman dan generate invoice.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border px-4 py-2"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}