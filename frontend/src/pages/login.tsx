import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import type { LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>("/api/login", {
        username,
        password,
      });

      login(response.data.token);
      await router.push("/dashboard");
    } catch {
      setError("Login gagal. Periksa username dan password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#FFFDF7] relative overflow-hidden">

      {/* Glow (soft warm) */}
      <div className="absolute top-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,200,30,0.18) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,200,30,0.1) 0%, transparent 70%)" }} />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md relative z-10 rounded-2xl p-8 space-y-6 shadow-sm"
        style={{ background: "#FFFBEB", border: "1px solid #F1E7C6" }}
      >

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#FFC81E] shadow-sm">
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <rect x="3" y="2" width="14" height="16" rx="2" fill="#fff"/>
                <rect x="6" y="6" width="8" height="1.5" rx="0.75" fill="#FFC81E"/>
                <rect x="6" y="9.5" width="5" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.5"/>
                <rect x="6" y="13" width="6" height="1.5" rx="0.75" fill="#FFC81E" fillOpacity="0.3"/>
              </svg>
            </div>
            <span className="text-slate-800 text-sm font-semibold tracking-wide">
              Invoice<span className="text-[#E6A800]">Wizard</span>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Selamat datang 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masukkan akun untuk melanjutkan ke dashboard.
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Username
            </label>
            <input
              className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-white border border-slate-200 outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-yellow-100"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-white border border-slate-200 outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-yellow-100"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl px-3.5 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-2.5 text-sm font-semibold tracking-wide transition-all active:scale-[0.98] disabled:opacity-50 bg-[#FFC81E] text-white hover:brightness-95"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        {/* Hint akun */}
        <div className="rounded-xl px-4 py-3 text-sm space-y-1 bg-[#FFF7D6] border border-[#F1E7C6]">
          <p className="text-slate-500">
            <span className="font-medium text-[#B88700]">Admin</span>
            {" "}— admin / admin123
          </p>
          <p className="text-slate-500">
            <span className="font-medium text-[#B88700]">Kerani</span>
            {" "}— kerani / kerani123
          </p>
        </div>

      </form>
    </main>
  );
}