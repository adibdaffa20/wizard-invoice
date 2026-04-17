import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { InvoiceLineForm, WizardState, WizardStep } from "@/types/invoice";

function generateRowId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createEmptyLine(): InvoiceLineForm {
  return {
    rowId: generateRowId(),
    itemCode: "",
    quantity: 1,
  };
}

type WizardActions = {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setStep: (step: WizardStep) => void;
  setClient: (payload: Partial<WizardState["client"]>) => void;
  addItemRow: () => void;
  removeItemRow: (rowId: string) => void;
  updateItemRow: (rowId: string, payload: Partial<InvoiceLineForm>) => void;
  resetWizard: () => void;
};

type Store = WizardState & WizardActions;

const createInitialState = (): WizardState => ({
  step: 1,
  client: {
    senderName: "",
    senderAddress: "",
    receiverName: "",
    receiverAddress: "",
  },
  items: [createEmptyLine()],
});

export const useInvoiceWizardStore = create<Store>()(
  persist(
    (set) => ({
      ...createInitialState(),
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setStep: (step) => set({ step }),

      setClient: (payload) =>
        set((state) => ({
          client: {
            ...state.client,
            ...payload,
          },
        })),

      addItemRow: () =>
        set((state) => ({
          items: [...state.items, createEmptyLine()],
        })),

      removeItemRow: (rowId) =>
        set((state) => {
          const nextItems = state.items.filter((row) => row.rowId !== rowId);

          return {
            items: nextItems.length > 0 ? nextItems : [createEmptyLine()],
          };
        }),

      updateItemRow: (rowId, payload) =>
        set((state) => {
            let changed = false;

            const nextItems = state.items.map((row) => {
            if (row.rowId !== rowId) return row;

            const nextRow = { ...row, ...payload };

            const isSame =
                row.itemCode === nextRow.itemCode &&
                row.itemId === nextRow.itemId &&
                row.itemName === nextRow.itemName &&
                row.quantity === nextRow.quantity &&
                row.price === nextRow.price &&
                row.subtotal === nextRow.subtotal;

            if (isSame) return row;

            changed = true;
            return nextRow;
            });

            if (!changed) return state;

            return { items: nextItems };
        }),

      resetWizard: () =>
        set({
          ...createInitialState(),
          hasHydrated: true,
        }),
    }),
    {
      name: "invoice-wizard-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);