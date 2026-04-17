import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { transformInvoicePayloadByRole } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";
import type { CreatedInvoiceResponse, SubmitInvoicePayload } from "@/types/invoice";

export default function Step3Review() {
  const role = useAuthStore((state) => state.role);
  const { client, items, setStep, resetWizard } = useInvoiceWizardStore();

  const grandTotal = items.reduce((total, item) => total + (item.subtotal ?? 0), 0);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload: SubmitInvoicePayload = {
        sender_name: client.senderName,
        sender_address: client.senderAddress,
        receiver_name: client.receiverName,
        receiver_address: client.receiverAddress,
        items: items.map((item) => ({
          item_id: item.itemId,
          code: item.itemCode,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
      };

      const transformedPayload = transformInvoicePayloadByRole(
        payload,
        role ?? "kerani"
      );

      const response = await api.post<CreatedInvoiceResponse>(
        "/api/invoices",
        transformedPayload
      );

      return response.data;
    },
    onSuccess: (data) => {
      alert(`Invoice berhasil dibuat: ${data.invoice_number}`);
      resetWizard();
    },
  });

  return (
    <>
      {/* Tampilan layar */}
      <div className="print:hidden rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Step 3 - Review & Cetak</h2>
          <p className="mt-1 text-sm text-slate-500">Periksa data sebelum submit.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="font-semibold">Data Pengirim</p>
            <p className="mt-2 text-sm">{client.senderName}</p>
            <p className="text-sm text-slate-600">{client.senderAddress}</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-semibold">Data Penerima</p>
            <p className="mt-2 text-sm">{client.receiverName}</p>
            <p className="text-sm text-slate-600">{client.receiverAddress}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">Kode</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.rowId} className="border-t">
                  <td className="p-3">{item.itemCode}</td>
                  <td className="p-3">{item.itemName ?? "-"}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.price?.toLocaleString("id-ID") ?? "-"}</td>
                  <td className="p-3">
                    {item.subtotal?.toLocaleString("id-ID") ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Role aktif</p>
            <p className="font-semibold uppercase">{role ?? "-"}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Grand Total</p>
            <p className="text-xl font-bold">Rp {grandTotal.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {submitMutation.isError && (
          <p className="text-sm text-red-600">Gagal menyimpan invoice.</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg border px-4 py-2 hover:bg-slate-50"
          >
            Kembali
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border px-4 py-2 hover:bg-slate-50"
            >
              Cetak Invoice
            </button>
            <button
              type="button"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitMutation.isPending ? "Menyimpan..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Layout print khusus A4 */}
      <div className="hidden print:block print-area text-black">
        <div className="mx-auto w-full max-w-[794px] bg-white p-8">
          <header className="border-b-2 border-black pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold uppercase">PT Wizard Invoice Indonesia</h1>
                <p className="text-sm">Jl. Contoh Kop Surat No. 123, Jakarta</p>
                <p className="text-sm">Telp: (021) 12345678 | Email: billing@wizardinvoice.test</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">INVOICE</p>
                <p className="text-sm">Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</p>
                <p className="text-sm">Role: {role?.toUpperCase() ?? "-"}</p>
              </div>
            </div>
          </header>

          <section className="mt-6 grid grid-cols-2 gap-8">
            <div>
              <p className="mb-2 text-sm font-bold uppercase">Pengirim</p>
              <p className="text-sm">{client.senderName}</p>
              <p className="text-sm whitespace-pre-line">{client.senderAddress}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold uppercase">Penerima</p>
              <p className="text-sm">{client.receiverName}</p>
              <p className="text-sm whitespace-pre-line">{client.receiverAddress}</p>
            </div>
          </section>

          <section className="mt-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left">Kode</th>
                  <th className="border border-black p-2 text-left">Nama Barang</th>
                  <th className="border border-black p-2 text-right">Qty</th>
                  <th className="border border-black p-2 text-right">Harga</th>
                  <th className="border border-black p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.rowId}>
                    <td className="border border-black p-2">{item.itemCode}</td>
                    <td className="border border-black p-2">{item.itemName ?? "-"}</td>
                    <td className="border border-black p-2 text-right">{item.quantity}</td>
                    <td className="border border-black p-2 text-right">
                      {item.price?.toLocaleString("id-ID") ?? "-"}
                    </td>
                    <td className="border border-black p-2 text-right">
                      {item.subtotal?.toLocaleString("id-ID") ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mt-6 flex justify-end">
            <div className="w-72">
              <div className="flex justify-between border border-black px-3 py-2 font-bold">
                <span>Grand Total</span>
                <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </section>

          <footer className="mt-16 grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold">Petugas,</p>
              <div className="h-20" />
              <p className="text-sm">(__________________)</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Penerima,</p>
              <div className="h-20" />
              <p className="text-sm">(__________________)</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}