import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";
import Step1Client from "./step-1-client";
import Step2Items from "./step-2-items";
import Step3Review from "./step-3-review";

export default function WizardShell() {
  const step = useInvoiceWizardStore((state) => state.step);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((value) => (
          <div
            key={value}
            className={`h-2 rounded-full ${step >= value ? "bg-slate-900" : "bg-slate-200"}`}
          />
        ))}
      </div>

      {step === 1 && <Step1Client />}
      {step === 2 && <Step2Items />}
      {step === 3 && <Step3Review />}
    </div>
  );
}