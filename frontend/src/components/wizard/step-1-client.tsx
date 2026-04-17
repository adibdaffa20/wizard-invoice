import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";

export default function Step1Client() {
  const client = useInvoiceWizardStore((state) => state.client);
  const setClient = useInvoiceWizardStore((state) => state.setClient);
  const setStep = useInvoiceWizardStore((state) => state.setStep);

  const canContinue =
    client.senderName.trim() &&
    client.senderAddress.trim() &&
    client.receiverName.trim() &&
    client.receiverAddress.trim();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Step 1 - Data Klien</h2>

      <div className="space-y-3">
        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
          placeholder="Nama Pengirim"
          value={client.senderName}
          onChange={(e) => setClient({ senderName: e.target.value })}
        />

        <textarea
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
          placeholder="Alamat Pengirim"
          rows={3}
          value={client.senderAddress}
          onChange={(e) => setClient({ senderAddress: e.target.value })}
        />

        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
          placeholder="Nama Penerima"
          value={client.receiverName}
          onChange={(e) => setClient({ receiverName: e.target.value })}
        />

        <textarea
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-900"
          placeholder="Alamat Penerima"
          rows={3}
          value={client.receiverAddress}
          onChange={(e) => setClient({ receiverAddress: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setStep(2)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}