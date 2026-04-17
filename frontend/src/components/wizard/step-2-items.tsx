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
  const { item, isLoading, error } = useItemSearch(code);

  useEffect(() => {
    if (item && row) {
      updateItemRow(row.rowId, {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        subtotal: item.price * quantity,
      });
    }
  }, [item, quantity, row, updateItemRow]);

  if (!row) {
    return null;
  }

  return (
    <tr className="border-b align-top">
      <td className="p-2">
        <input
          className="w-full rounded border px-2 py-1 outline-none focus:border-slate-900"
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
        {isLoading && <p className="mt-1 text-xs text-slate-500">Mencari...</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
      <td className="p-2">{row.itemName ?? "-"}</td>
      <td className="p-2">
        <input
          type="number"
          min={1}
          className="w-24 rounded border px-2 py-1 outline-none focus:border-slate-900"
          value={row.quantity}
          onChange={(e) => {
            const nextQuantity = Number(e.target.value) || 1;
            updateItemRow(row.rowId, {
              quantity: nextQuantity,
              subtotal: row.price ? row.price * nextQuantity : undefined,
            });
          }}
        />
      </td>
      <td className="p-2">{row.price ? row.price.toLocaleString("id-ID") : "-"}</td>
      <td className="p-2">{row.subtotal ? row.subtotal.toLocaleString("id-ID") : "-"}</td>
      <td className="p-2">
        <button
          type="button"
          onClick={() => removeItemRow(row.rowId)}
          className="rounded bg-red-600 px-3 py-1 text-white hover:opacity-90"
        >
          Hapus
        </button>
      </td>
    </tr>
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
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Step 2 - Data Barang</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ketik kode barang, sistem akan mencari item setelah 500ms.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Kode Barang</th>
              <th className="p-2">Nama Barang</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Subtotal</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <ItemRow key={row.rowId} rowId={row.rowId} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="rounded-lg border px-4 py-2 hover:bg-slate-50"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={addItemRow}
            className="rounded-lg border px-4 py-2 hover:bg-slate-50"
          >
            Tambah Baris
          </button>
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={() => setStep(3)}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review
        </button>
      </div>
    </div>
  );
}