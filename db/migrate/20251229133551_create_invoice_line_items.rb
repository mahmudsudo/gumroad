# frozen_string_literal: true

class CreateInvoiceLineItems < ActiveRecord::Migration[7.0]
  def change
    create_table :invoice_line_items do |t|
      t.references :invoice, null: false, foreign_key: true
      t.text :description
      t.integer :amount_cents, default: 0
      t.references :paid_by_invoice, foreign_key: { to_table: :invoices }
      t.timestamps
    end
  end
end
