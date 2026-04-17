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

  const isAdmin = role === "admin";

  return (
    <ProtectedLayout>
      <main className="min-h-screen bg-[#FFFDF7] px-4 py-6 md:px-8 md:py-8 relative overflow-hidden">

        {/* Glow */}
        <div
          className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,200,30,0.15) 0%, transparent 70%)" }}
        />

        <div className="mx-auto max-w-5xl space-y-6 relative z-10">

          {/* Header */}
          <div className="flex flex-col gap-4 rounded-xl border border-[#F1E7C6] bg-[#FFFBEB] px-6 py-5 md:flex-row md:items-center md:justify-between shadow-sm">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FFC81E] shadow-sm">
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                  <rect x="3" y="2" width="14" height="16" rx="2" fill="#fff" />
                  <rect x="6" y="6" width="8" height="1.5" rx="0.75" fill="#FFC81E" />
                  <rect x="6" y="9.5" width="5" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.5" />
                  <rect x="6" y="13" width="6" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.3" />
                </svg>
              </div>

              <div>
                <h1 className="text-slate-800 text-lg font-semibold leading-none">
                  Dashboard
                </h1>
                <p className="text-xs mt-1 text-slate-500">
                  Invoice<span className="text-[#E6A800]">Wizard</span>
                </p>
              </div>

              {/* Role badge */}
              <div
                className={`ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border
                ${isAdmin
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {role}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
            >
              Logout
            </button>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* Buat Invoice */}
            <div className="rounded-xl border border-[#F1E7C6] bg-white p-6 flex flex-col justify-between min-h-[200px] shadow-sm hover:shadow-md transition">
              <div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 bg-yellow-100 border border-yellow-200">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M8 3v10M3 8h10" stroke="#E6A800" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h2 className="text-slate-800 text-base font-semibold mb-1.5">
                  Buat Invoice
                </h2>

                <p className="text-sm text-slate-500 leading-relaxed">
                  Input data klien, tambah barang, lalu generate invoice dengan cepat.
                </p>
              </div>

              <Link
                href="/wizard"
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] self-start bg-[#FFC81E] text-white hover:brightness-95"
              >
                Mulai →
              </Link>
            </div>

            {/* Catatan Requirement */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 bg-slate-100 border border-slate-200">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="#888" strokeWidth="1.2" />
                  <path d="M5 5.5h6M5 8h4M5 10.5h5" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>

              <h2 className="text-slate-800 text-base font-semibold mb-3">
                Catatan Sistem
              </h2>

              <ul className="space-y-2.5">
                {[
                  "State wizard tersimpan otomatis",
                  "Debounce + cancel request",
                  "Role Admin & Kerani",
                  "Autentikasi JWT",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-500">
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-[#FFC81E] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-400">
            InvoiceWizard v1.0.0 — {new Date().getFullYear()}
          </p>

        </div>
      </main>
    </ProtectedLayout>
  );
}