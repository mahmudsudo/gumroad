# frozen_string_literal: true

class AddPrLinkToInvoiceLineItems < ActiveRecord::Migration[7.0]
  def change
    add_column :invoice_line_items, :pr_link, :string
  end
end
