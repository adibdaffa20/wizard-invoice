import type { WizardState } from "@/types/invoice";

const STORAGE_PREFIX = "invoice-wizard-storage";

function getStorageKey(userId: number) {
  return `${STORAGE_PREFIX}-user-${userId}`;
}

export function saveWizardToStorage(userId: number, state: WizardState) {
  if (typeof window === "undefined") return;

  localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
}

export function loadWizardFromStorage(userId: number): WizardState | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(getStorageKey(userId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as WizardState;
  } catch {
    return null;
  }
}

export function clearWizardFromStorage(userId: number) {
  if (typeof window === "undefined") return;

  localStorage.removeItem(getStorageKey(userId));
}