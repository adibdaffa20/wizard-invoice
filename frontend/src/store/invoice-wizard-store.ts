import { create } from "zustand";
  addItemRow: () => void;
  removeItemRow: (rowId: string) => void;
  updateItemRow: (rowId: string, payload: Partial<InvoiceLineForm>) => void;
  resetWizard: () => void;
};

type Store = WizardState & WizardActions;

const initialState: WizardState = {
  step: 1,
  client: {
    senderName: "",
    senderAddress: "",
    receiverName: "",
    receiverAddress: "",
  },
  items: [createEmptyLine()],
};

export const useInvoiceWizardStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,
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
        set((state) => ({
          items: state.items.map((row) =>
            row.rowId === rowId
              ? {
                  ...row,
                  ...payload,
                }
              : row
          ),
        })),
      resetWizard: () =>
        set({
          ...initialState,
          items: [createEmptyLine()],
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