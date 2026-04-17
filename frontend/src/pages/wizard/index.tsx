import LoadingScreen from "@/components/common/loading-screen";
import ProtectedLayout from "@/components/layout/protected-layout";
import WizardShell from "@/components/wizard/wizard-shell";
import { useWizardPersistence } from "@/hooks/use-wizard-persistence";
import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";

export default function WizardPage() {
  useWizardPersistence();

  const hasHydrated = useInvoiceWizardStore((state) => state.hasHydrated);

  return (
    <ProtectedLayout>
      {!hasHydrated ? (
        <LoadingScreen />
      ) : (
        <main className="min-h-screen p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Wizard Invoice</h1>
              <p className="mt-1 text-sm text-slate-500">
                Draft wizard tersimpan per user login.
              </p>
            </div>

            <WizardShell />
          </div>
        </main>
      )}
    </ProtectedLayout>
  );
}