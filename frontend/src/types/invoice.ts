export type InvoiceLineForm = {
  rowId: string;
  itemCode: string;
  itemId?: number;
  itemName?: string;
  quantity: number;
  price?: number;
  subtotal?: number;
};

export type ClientForm = {
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
};

export type WizardStep = 1 | 2 | 3;

export type WizardState = {
  step: WizardStep;
  client: ClientForm;
  items: InvoiceLineForm[];
};

export type SubmitInvoicePayload = {
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  items: Array<{
    item_id?: number;
    code: string;
    quantity: number;
    price?: number;
    subtotal?: number;
  }>;
};

export type CreatedInvoiceResponse = {
  id: number;
  invoice_number: string;
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  total_amount: number;
  created_by: number;
  created_at: string;
  details: Array<{
    id: number;
    invoice_id: number;
    item_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    item: {
      id: number;
      code: string;
      name: string;
      price: number;
    };
  }>;
};