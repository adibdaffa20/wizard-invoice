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
    <main className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm space-y-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gunakan akun admin atau kerani untuk masuk.
          </p>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Masuk..." : "Login"}
        </button>

        <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-600">
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Kerani:</strong> kerani / kerani123</p>
        </div>
      </form>
    </main>
  );
}