import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#FFFDF7] relative overflow-hidden">

      {/* Glow background (lebih soft & warm) */}
      <div
        className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,200,30,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,200,30,0.1) 0%, transparent 70%)" }}
      />

      <div
        className="w-full max-w-2xl rounded-3xl p-10 relative z-10 shadow-sm"
        style={{ background: "#FFFBEB", border: "1px solid rgba(255,200,30,0.25)" }}
      >

        {/* Logo row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FFC81E] shadow-sm">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <rect x="3" y="2" width="14" height="16" rx="2" fill="#fff" />
              <rect x="6" y="6" width="8" height="1.5" rx="0.75" fill="#FFC81E" />
              <rect x="6" y="9.5" width="5" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.5" />
              <rect x="6" y="13" width="6" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.3" />
            </svg>
          </div>

          <span className="text-slate-800 text-base font-semibold tracking-wide">
            Invoice<span className="text-[#E6A800]">Wizard</span>
          </span>

          {/* Status badge */}
          <div
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: "rgba(255,200,30,0.12)", border: "1px solid rgba(255,200,30,0.3)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#E6A800]" />
            <span className="text-[#E6A800] text-[11px] font-medium">Sistem Aktif</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px bg-[#F1E7C6]" />

        {/* Heading */}
        <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-4">
          Pencatatan Resi &<br />
          <span className="text-[#E6A800]">Invoice Otomatis</span>
        </h1>

        <p className="text-sm leading-relaxed mb-8 text-slate-500">
          Aplikasi multi-step untuk mencatat resi pengiriman dan generate invoice
          secara cepat, rapi, dan terstruktur.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["Multi-step Form", "Generate Invoice", "Manajemen Resi", "Role Admin & Kerani"].map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background: "rgba(255,200,30,0.12)",
                border: "1px solid rgba(255,200,30,0.25)",
                color: "#B88700",
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl px-6 py-2.5 text-sm font-semibold tracking-wide transition-all active:scale-[0.98] hover:brightness-95"
            style={{ background: "#FFC81E", color: "#fff" }}
          >
            Mulai Login →
          </Link>

          <div
            className="rounded-xl px-6 py-2.5 text-sm font-medium"
            style={{
              background: "#FFF7D6",
              border: "1px solid #F1E7C6",
              color: "#A0A0A0",
            }}
          >
            v1.0.0
          </div>
        </div>

      </div>
    </main>
  );
}