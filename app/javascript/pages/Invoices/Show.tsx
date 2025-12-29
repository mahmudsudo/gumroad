import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";
import PrHoverCard from "../../components/PrHoverCard";
import PaidBadge from "../../components/PaidBadge";

type InvoiceLineItem = {
  id: string;
  description: string;
  amount_cents: number;
  pr_link: string | null;
  pr_data: {
    title: string;
    state: string;
    merged: boolean;
    bounty_amount: number | null;
  } | null;
  paid_by_invoice_id: string | null;
};

type Invoice = {
  id: string;
  contractor_name: string | null;
  status: string;
  total_amount_cents: number;
  description: string;
  created_at: string;
  invoice_line_items: InvoiceLineItem[];
};

type InvoiceShowProps = {
  invoice: Invoice;
};

export default function InvoiceShow() {
  const props = cast<InvoiceShowProps>(usePage().props);

  return (
    <div className="p-4! md:p-8!">
      <header className="mb-6">
        <h1>Invoice #{props.invoice.id}</h1>
        <div className="flex gap-2">
          <Link href="/invoices" className="btn btn-secondary">
            Back to Invoices
          </Link>
          <Link href={`/invoices/${props.invoice.id}/edit`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </header>

      <div className="space-y-4">
        <div className="border rounded p-4">
          <h3>Details</h3>
          <p>Contractor: {props.invoice.contractor_name || "N/A"}</p>
          <p>Status: {props.invoice.status}</p>
          <p>Description: {props.invoice.description}</p>
          <p>Total: ${(props.invoice.total_amount_cents / 100).toFixed(2)}</p>
        </div>

        <div className="border rounded p-4">
          <h3>Line Items</h3>
          <div className="space-y-2">
            {props.invoice.invoice_line_items.map((item) => (
              <div key={item.id} className="border rounded p-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p>{item.description}</p>
                    {item.pr_link && (
                      <p>
                        PR:{" "}
                        <PrHoverCard prData={item.pr_data}>
                          <a href={item.pr_link} target="_blank" rel="noopener noreferrer">
                            {item.pr_link}
                          </a>
                        </PrHoverCard>
                        {item.pr_data && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({item.pr_data.title} - {item.pr_data.state})
                          </span>
                        )}
                      </p>
                    )}
                    <PaidBadge paid={!!item.paid_by_invoice_id} />
                  </div>
                  <p>${(item.amount_cents / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
