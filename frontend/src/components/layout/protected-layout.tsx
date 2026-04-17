import { useEffect } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@/components/common/loading-screen";
import { useAuthStore } from "@/store/auth-store";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !token) {
      void router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  if (!token) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}