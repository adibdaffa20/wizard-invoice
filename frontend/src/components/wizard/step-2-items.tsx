import { useEffect } from "react";
import { useInvoiceWizardStore } from "@/store/invoice-wizard-store";
import { useItemSearch } from "@/hooks/use-item-search";

type ItemRowProps = {
  rowId: string;
};

function ItemRow({ rowId }: ItemRowProps) {
  const row = useInvoiceWizardStore((state) =>
    state.items.find((item) => item.rowId === rowId)
  );
  const updateItemRow = useInvoiceWizardStore((state) => state.updateItemRow);
  const removeItemRow = useInvoiceWizardStore((state) => state.removeItemRow);

  const code = row?.itemCode ?? "";
  const quantity = row?.quantity ?? 1;
  const { item, isLoading, error, debouncedCode } = useItemSearch(code);

  useEffect(() => {
    if (!row || !item) return;
    if (debouncedCode !== row.itemCode.trim().toUpperCase()) return;

    const nextSubtotal = item.price * quantity;
    const isSameValue =
      row.itemId === item.id &&
      row.itemName === item.name &&
      row.price === item.price &&
      row.subtotal === nextSubtotal;

    if (isSameValue) return;

    updateItemRow(row.rowId, {
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      subtotal: nextSubtotal,
    });
  }, [
    row?.rowId, row?.itemId, row?.itemName, row?.price, row?.subtotal,
    row?.itemCode, item?.id, item?.name, item?.price,
    quantity, debouncedCode, updateItemRow,
  ]);

  if (!row) return null;

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-[#FFC81E] focus:ring-2 focus:ring-[#FFC81E]/20";

  return (
    <div className="grid grid-cols-[1fr_2fr_80px_1fr_1fr_40px] gap-3 items-start rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      {/* Kode barang */}
      <div className="space-y-1">
        <input
          className={inputClass}
          value={row.itemCode}
          onChange={(e) =>
            updateItemRow(row.rowId, {
              itemCode: e.target.value,
              itemId: undefined,
              itemName: undefined,
              price: undefined,
              subtotal: undefined,
            })
          }
          placeholder="BRG-001"
        />
        {isLoading && (
          <p className="text-xs text-slate-400">Mencari...</p>
        )}
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* Nama barang */}
      <div className="flex h-9 items-center">
        {row.itemName ? (
          <span className="text-sm text-slate-700">{row.itemName}</span>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </div>

      {/* Qty */}
      <input
        type="number"
        min={1}
        className={inputClass}
        value={row.quantity}
        onChange={(e) => {
          const nextQuantity = Number(e.target.value) || 1;
          const nextSubtotal = row.price ? row.price * nextQuantity : undefined;
          updateItemRow(row.rowId, { quantity: nextQuantity, subtotal: nextSubtotal });
        }}
      />

      {/* Harga */}
      <div className="flex h-9 items-center text-sm text-slate-600">
        {typeof row.price === "number"
          ? "Rp " + row.price.toLocaleString("id-ID")
          : <span className="text-slate-300">—</span>}
      </div>

      {/* Subtotal */}
      <div className="flex h-9 items-center text-sm font-medium text-slate-800">
        {typeof row.subtotal === "number"
          ? "Rp " + row.subtotal.toLocaleString("id-ID")
          : <span className="text-slate-300">—</span>}
      </div>

      {/* Hapus */}
      <button
        type="button"
        onClick={() => removeItemRow(row.rowId)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

export default function Step2Items() {
  const items = useInvoiceWizardStore((state) => state.items);
  const setStep = useInvoiceWizardStore((state) => state.setStep);
  const addItemRow = useInvoiceWizardStore((state) => state.addItemRow);

  const canContinue = items.every(
    (item) => item.itemCode.trim() && item.itemId && item.quantity > 0
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-[#B8900A]">
          Langkah 2 dari 3
        </p>
        <p className="mt-0.5 text-sm text-slate-400">
          Ketik kode barang — nama & harga akan otomatis terisi.
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_2fr_80px_1fr_1fr_40px] gap-3 px-4">
        {["Kode", "Nama barang", "Qty", "Harga satuan", "Subtotal", ""].map((h) => (
          <span key={h} className="text-xs font-medium text-slate-400">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {items.map((row) => (
          <ItemRow key={row.rowId} rowId={row.rowId} />
        ))}
      </div>

      {/* Add row */}
      <button
        type="button"
        onClick={addItemRow}
        className="flex items-center gap-2 rounded-lg border border-dashed border-[#FFC81E] bg-[#FFFBF0] px-4 py-2.5 text-sm font-medium text-[#B8900A] transition hover:bg-[#FFF3C4]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Tambah baris
      </button>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
        >
          ← Kembali
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setStep(3)}
          className="rounded-lg bg-[#FFC81E] px-5 py-2 text-sm font-medium text-[#5C3D00] transition hover:bg-[#FFB800] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Review →
        </button>
      </div>
    </div>
  );
}