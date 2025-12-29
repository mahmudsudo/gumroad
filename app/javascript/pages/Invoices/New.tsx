import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";
import PrLinkInput from "../../components/PrLinkInput";

type InvoiceFormProps = {
  contractors: { id: string; name: string }[];
};

export default function InvoiceNew() {
  const props = cast<InvoiceFormProps>(usePage().props);
  const [lineItems, setLineItems] = React.useState([{ description: "", amount_cents: 0, pr_link: "" }]);

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", amount_cents: 0, pr_link: "" }]);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const newItems = [...lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setLineItems(newItems);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4! md:p-8!">
      <header className="mb-6">
        <h1>Create Invoice</h1>
        <Link href="/invoices" className="btn btn-secondary">
          Back to Invoices
        </Link>
      </header>

      <form action="/invoices" method="post" className="space-y-4">
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
          <textarea name="description" id="description" required />
        </div>

        <div>
          <h3>Line Items</h3>
          {lineItems.map((item, index) => (
            <div key={index} className="border rounded p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    name={`invoice[invoice_line_items_attributes][${index}][description]`}
                    required
                  />
                </div>
                <div>
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.amount_cents / 100}
                    onChange={(e) => updateLineItem(index, "amount_cents", Math.round(parseFloat(e.target.value) * 100))}
                    name={`invoice[invoice_line_items_attributes][${index}][amount_cents]`}
                    required
                  />
                </div>
                <div>
                  <label>PR Link (optional)</label>
                  <PrLinkInput
                    value={item.pr_link}
                    onChange={(value) => updateLineItem(index, "pr_link", value)}
                  />
                  <input
                    type="hidden"
                    name={`invoice[invoice_line_items_attributes][${index}][pr_link]`}
                    value={item.pr_link}
                  />
                </div>
              </div>
              {lineItems.length > 1 && (
                <button type="button" onClick={() => removeLineItem(index)} className="btn btn-danger mt-2">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addLineItem} className="btn btn-secondary">
            Add Line Item
          </button>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Invoice
        </button>
      </form>
    </div>
  );
}
