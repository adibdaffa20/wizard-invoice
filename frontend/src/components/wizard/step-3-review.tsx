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
      {/* ─── Tampilan Layar ─── */}
      <div className="print:hidden p-6 space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#B8900A]">
            Langkah 3 dari 3
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-[#FFC81E]" />
              <span className="text-sm font-medium text-slate-700">Pengirim</span>
            </div>
            <div className="rounded-lg border border-slate-200 px-3 py-2 space-y-0.5">
              <p className="text-sm font-medium text-slate-800">{client.senderName || "-"}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line">{client.senderAddress || "-"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-slate-200" />
              <span className="text-sm font-medium text-slate-700">Penerima</span>
            </div>
            <div className="rounded-lg border border-slate-200 px-3 py-2 space-y-0.5">
              <p className="text-sm font-medium text-slate-800">{client.receiverName || "-"}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line">{client.receiverAddress || "-"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-[#FFC81E]" />
            <span className="text-sm font-medium text-slate-700">Daftar Barang</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#FFF8E1] text-left">
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#B8900A]">Kode</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#B8900A]">Nama</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#B8900A]">Qty</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#B8900A]">Harga</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#B8900A]">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.rowId} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-slate-700">{item.itemCode}</td>
                    <td className="px-3 py-2 text-slate-700">{item.itemName ?? "-"}</td>
                    <td className="px-3 py-2 text-slate-700">{item.quantity}</td>
                    <td className="px-3 py-2 text-slate-700">{item.price?.toLocaleString("id-ID") ?? "-"}</td>
                    <td className="px-3 py-2 text-slate-700">{item.subtotal?.toLocaleString("id-ID") ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-slate-200 px-4 py-3 bg-[#FFFDF5]">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Role Aktif</p>
            <p className="text-sm font-semibold text-slate-800 uppercase">{role ?? "-"}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Grand Total</p>
            <p className="text-xl font-bold text-[#5C3D00]">Rp {grandTotal.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {submitMutation.isError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            Gagal menyimpan invoice. Silakan coba lagi.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            ← Kembali
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cetak Invoice
            </button>
            <button
              type="button"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="rounded-lg bg-[#FFC81E] px-5 py-2 text-sm font-medium text-[#5C3D00] transition hover:bg-[#FFB800] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitMutation.isPending ? "Menyimpan..." : "Submit →"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Layout Print A4 ─── */}
      <div className="hidden print:block print-area">
        <div
          style={{
            fontFamily: "'Arial', sans-serif",
            color: "#1a1a1a",
            width: "210mm",
            minHeight: "297mm",
            margin: "0 auto",
            padding: "16mm 18mm",
            backgroundColor: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          {/* Kop Surat */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8mm" }}>
            <div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#1a1a1a", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                FLEETIFY
              </div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#D4A017", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                PT Teknologi Integrasi Armada
              </div>
              <div style={{ marginTop: "6px", fontSize: "9px", color: "#666", lineHeight: "1.7" }}>
                <div>Jl. Contoh Kop Surat No. 123, Jakarta 10110</div>
                <div>Telp: (021) 12345678 &nbsp;·&nbsp; Email: billing@wizardinvoice.test</div>
                <div>www.wizardinvoice.test</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "30px", fontWeight: "800", color: "#D4A017", letterSpacing: "5px", lineHeight: 1 }}>
                INVOICE
              </div>
              <div style={{ marginTop: "8px", fontSize: "9px", color: "#666", lineHeight: "1.8" }}>
                <div>
                  <span style={{ color: "#aaa" }}>Tanggal &nbsp;</span>
                  <strong style={{ color: "#1a1a1a" }}>
                    {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#aaa" }}>Role &nbsp;</span>
                  <strong style={{ color: "#1a1a1a" }}>{role?.toUpperCase() ?? "-"}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Garis aksen */}
          <div style={{ height: "3px", background: "linear-gradient(to right, #D4A017, #ffe082)", marginBottom: "8mm", borderRadius: "2px" }} />

          {/* Pengirim & Penerima */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6mm", marginBottom: "8mm" }}>
            {[
              { label: "Dari / Pengirim", name: client.senderName, address: client.senderAddress },
              { label: "Kepada / Penerima", name: client.receiverName, address: client.receiverAddress },
            ].map((party) => (
              <div
                key={party.label}
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #ebebeb",
                  borderRadius: "6px",
                  padding: "4mm 5mm",
                }}
              >
                <div style={{ fontSize: "8px", fontWeight: "700", color: "#D4A017", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>
                  {party.label}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "#1a1a1a", marginBottom: "2px" }}>
                  {party.name || "-"}
                </div>
                <div style={{ fontSize: "9.5px", color: "#666", lineHeight: "1.5", whiteSpace: "pre-line" }}>
                  {party.address || "-"}
                </div>
              </div>
            ))}
          </div>

          {/* Tabel Item */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginBottom: "6mm" }}>
            <thead>
              <tr style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}>
                {[
                  { label: "No", align: "center" as const, width: "5%" },
                  { label: "Kode", align: "left" as const, width: "14%" },
                  { label: "Nama Barang", align: "left" as const, width: "auto" },
                  { label: "Qty", align: "center" as const, width: "8%" },
                  { label: "Harga Satuan", align: "right" as const, width: "18%" },
                  { label: "Subtotal", align: "right" as const, width: "18%" },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      padding: "7px 10px",
                      textAlign: col.align,
                      fontWeight: "600",
                      letterSpacing: "0.4px",
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.rowId}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    borderBottom: "1px solid #ebebeb",
                  }}
                >
                  <td style={{ padding: "7px 10px", textAlign: "center", color: "#aaa" }}>{index + 1}</td>
                  <td style={{ padding: "7px 10px", color: "#555" }}>{item.itemCode}</td>
                  <td style={{ padding: "7px 10px", color: "#1a1a1a", fontWeight: "500" }}>{item.itemName ?? "-"}</td>
                  <td style={{ padding: "7px 10px", textAlign: "center", color: "#333" }}>{item.quantity}</td>
                  <td style={{ padding: "7px 10px", textAlign: "right", color: "#333" }}>
                    Rp {item.price?.toLocaleString("id-ID") ?? "-"}
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", color: "#1a1a1a", fontWeight: "600" }}>
                    Rp {item.subtotal?.toLocaleString("id-ID") ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10mm" }}>
            <div style={{ width: "68mm" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#D4A017",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                }}
              >
                <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "0.5px" }}>GRAND TOTAL</span>
                <span style={{ fontSize: "13px", fontWeight: "800" }}>
                  Rp {grandTotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div
            style={{
              backgroundColor: "#fffbef",
              border: "1px solid #f0e0a0",
              borderRadius: "6px",
              padding: "3.5mm 5mm",
              marginBottom: "10mm",
              fontSize: "8.5px",
              color: "#7a6000",
              lineHeight: "1.6",
            }}
          >
            <strong>Catatan:</strong> Invoice ini sah dan diterbitkan secara resmi. Harap melakukan pembayaran sesuai dengan nominal yang tertera.
            Jika ada pertanyaan, silakan hubungi kami di billing@wizardinvoice.test.
          </div>

          {/* Tanda Tangan */}
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "7mm", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6mm" }}>
            {[
              { label: "Dibuat oleh", name: "Petugas" },
              { label: "Diperiksa oleh", name: "Supervisor" },
              { label: "Diterima oleh", name: "Penerima" },
            ].map((sig) => (
              <div key={sig.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "8.5px", color: "#aaa", marginBottom: "3px" }}>{sig.label}</div>
                <div style={{ height: "16mm", borderBottom: "1px solid #1a1a1a", margin: "0 8mm" }} />
                <div style={{ fontSize: "9.5px", marginTop: "4px", fontWeight: "600", color: "#1a1a1a" }}>
                  ({sig.name})
                </div>
              </div>
            ))}
          </div>

          {/* Footer halaman */}
          <div
            style={{
              marginTop: "8mm",
              textAlign: "center",
              fontSize: "8px",
              color: "#ccc",
              borderTop: "1px dashed #e8e8e8",
              paddingTop: "4mm",
            }}
          >
            PT Teknologi Integrasi Armada &nbsp;·&nbsp; Jl. Contoh Kop Surat No. 123, Jakarta &nbsp;·&nbsp; billing@wizardinvoice.test
          </div>
        </div>
      </div>
    </>
  );
}