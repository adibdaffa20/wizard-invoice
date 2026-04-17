import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";
import Step1Client from "./step-1-client";
import Step2Items from "./step-2-items";
import Step3Review from "./step-3-review";

const STEPS = [
  { number: 1, label: "Klien" },
  { number: 2, label: "Item" },
  { number: 3, label: "Review" },
];

export default function WizardShell() {
  const step = useInvoiceWizardStore((state) => state.step);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-slate-100">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#FFC81E] transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map(({ number, label }) => {
          const isDone = step > number;
          const isActive = step === number;

          return (
            <div key={number} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200
                  ${isDone ? "bg-[#FFF3C4] text-[#B8900A] ring-1 ring-[#FFC81E]" : ""}
                  ${isActive ? "bg-[#FFC81E] text-[#5C3D00]" : ""}
                  ${!isDone && !isActive ? "bg-slate-100 text-slate-400" : ""}
                `}
              >
                {isDone ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  number
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-[#B8900A]" : isDone ? "text-[#B8900A]" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        {step === 1 && <Step1Client />}
        {step === 2 && <Step2Items />}
        {step === 3 && <Step3Review />}
      </div>
    </div>
  );
}