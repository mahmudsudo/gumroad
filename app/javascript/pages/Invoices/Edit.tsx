import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

type InvoiceLineItem = {
  id: string;
  description: string;
  amount_cents: number;
  pr_link: string | null;
};

type Invoice = {
  id: string;
  contractor_name: string | null;
  status: string;
  description: string;
  invoice_line_items: InvoiceLineItem[];
};

type InvoiceEditProps = {
  invoice: Invoice;
  contractors: { id: string; name: string }[];
};

export default function InvoiceEdit() {
  const props = cast<InvoiceEditProps>(usePage().props);

  return (
    <div className="p-4! md:p-8!">
      <header className="mb-6">
        <h1>Edit Invoice #{props.invoice.id}</h1>
        <div className="flex gap-2">
          <Link href={`/invoices/${props.invoice.id}`} className="btn btn-secondary">
            Back to Invoice
          </Link>
          <Link href="/invoices" className="btn btn-secondary">
            Back to Invoices
          </Link>
        </div>
      </header>

      <form action={`/invoices/${props.invoice.id}`} method="post" className="space-y-4">
        <input type="hidden" name="_method" value="patch" />

        <div>
          <label htmlFor="contractor_id">Contractor</label>
          <select name="contractor_id" id="contractor_id" required>
            <option value="">Select a contractor</option>
            {props.contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>
                {contractor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" defaultValue={props.invoice.description} required />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select name="status" id="status" defaultValue={props.invoice.status}>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Invoice
        </button>
      </form>
    </div>
  );
}
