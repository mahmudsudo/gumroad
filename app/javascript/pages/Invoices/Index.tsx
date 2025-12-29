import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

type Invoice = {
  id: string;
  contractor_name: string | null;
  status: string;
  total_amount_cents: number;
  created_at: string;
};

type InvoicesIndexProps = {
  invoices: Invoice[];
};

export default function InvoicesIndex() {
  const props = cast<InvoicesIndexProps>(usePage().props);

  return (
    <div className="p-4! md:p-8!">
      <header className="mb-6">
        <h1>Invoices</h1>
        <Link href="/invoices/new" className="btn btn-primary">
          Create Invoice
        </Link>
      </header>

      <div className="space-y-4">
        {props.invoices.map((invoice) => (
          <div key={invoice.id} className="border rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3>Invoice #{invoice.id}</h3>
                <p>Contractor: {invoice.contractor_name || "N/A"}</p>
                <p>Status: {invoice.status}</p>
                <p>Total: ${(invoice.total_amount_cents / 100).toFixed(2)}</p>
              </div>
              <Link href={`/invoices/${invoice.id}`} className="btn btn-secondary">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
