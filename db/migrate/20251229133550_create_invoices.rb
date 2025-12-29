# frozen_string_literal: true

class CreateInvoices < ActiveRecord::Migration[7.0]
  def change
    create_table :invoices do |t|
      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.references :contractor, foreign_key: { to_table: :users }
      t.integer :status, default: 0
      t.timestamps
    end
  end
end
