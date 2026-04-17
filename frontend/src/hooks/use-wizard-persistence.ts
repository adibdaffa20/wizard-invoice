import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  createInitialWizardState,
  useInvoiceWizardStore,
} from "@/store/invoice-wizard-store";
import {
  loadWizardFromStorage,
  saveWizardToStorage,
} from "@/lib/wizard-storage";

export function useWizardPersistence() {
  const userId = useAuthStore((state) => state.userId);
  const authHydrated = useAuthStore((state) => state.hasHydrated);

  const step = useInvoiceWizardStore((state) => state.step);
  const client = useInvoiceWizardStore((state) => state.client);
  const items = useInvoiceWizardStore((state) => state.items);
  const hasHydrated = useInvoiceWizardStore((state) => state.hasHydrated);
  const setHasHydrated = useInvoiceWizardStore((state) => state.setHasHydrated);
  const replaceWizardState = useInvoiceWizardStore((state) => state.replaceWizardState);

  const loadedUserIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!authHydrated) return;

    if (!userId) {
      replaceWizardState(createInitialWizardState());
      setHasHydrated(true);
      loadedUserIdRef.current = null;
      return;
    }

    if (loadedUserIdRef.current === userId) return;

    const saved = loadWizardFromStorage(userId);

    if (saved) {
      replaceWizardState(saved);
    } else {
      replaceWizardState(createInitialWizardState());
    }

    setHasHydrated(true);
    loadedUserIdRef.current = userId;
  }, [authHydrated, userId, replaceWizardState, setHasHydrated]);

  useEffect(() => {
    if (!authHydrated || !hasHydrated || !userId) return;

    saveWizardToStorage(userId, {
      step,
      client,
      items,
    });
  }, [authHydrated, hasHydrated, userId, step, client, items]);
}