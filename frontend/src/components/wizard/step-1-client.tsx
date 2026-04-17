import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";

export default function Step1Client() {
  const client = useInvoiceWizardStore((state) => state.client);
  const setClient = useInvoiceWizardStore((state) => state.setClient);
  const setStep = useInvoiceWizardStore((state) => state.setStep);

  const canContinue =
    client.senderName.trim() &&
    client.senderAddress.trim() &&
    client.receiverName.trim();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#B8900A]">
          Langkah 1 dari 3
        </p>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Pengirim */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-[#FFC81E]" />
            <span className="text-sm font-medium text-slate-700">Pengirim</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Nama <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-[#FFC81E]/20"
              placeholder="PT Maju Jaya"
              value={client.senderName}
              onChange={(e) => setClient({ senderName: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Alamat <span className="text-red-400">*</span>
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-[#FFC81E]/20"
              placeholder="Jl. Sudirman No. 1, Jakarta"
              rows={3}
              value={client.senderAddress}
              onChange={(e) => setClient({ senderAddress: e.target.value })}
            />
          </div>
        </div>

        {/* Penerima */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-slate-200" />
            <span className="text-sm font-medium text-slate-700">Penerima</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">
              Nama <span className="text-red-400">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-[#FFC81E]/20"
              placeholder="CV Berkah Selalu"
              value={client.receiverName}
              onChange={(e) => setClient({ receiverName: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Alamat</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-[#FFC81E]/20"
              placeholder="Jl. Gatot Subroto No. 5, Surabaya"
              rows={3}
              value={client.receiverAddress}
              onChange={(e) => setClient({ receiverAddress: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          <span className="text-red-400">*</span> Wajib diisi
        </p>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setStep(2)}
          className="rounded-lg bg-[#FFC81E] px-5 py-2 text-sm font-medium text-[#5C3D00] transition hover:bg-[#FFB800] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Lanjut →
        </button>
      </div>
    </div>
  );
}