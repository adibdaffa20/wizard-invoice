import type { SubmitInvoicePayload } from "@/types/invoice";
import type { UserRole } from "@/types/auth";

export function transformInvoicePayloadByRole(
  payload: SubmitInvoicePayload,
  role: UserRole
): SubmitInvoicePayload {
  if (role === "admin") {
    return payload;
  }

  return {
    ...payload,
    items: payload.items.map((item) => ({
      item_id: item.item_id,
      code: item.code,
      quantity: item.quantity,
    })),
  };
}