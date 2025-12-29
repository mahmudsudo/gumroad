# frozen_string_literal: true

class Invoice < ApplicationRecord
  include ExternalId
  include Deletable

  belongs_to :creator, class_name: "User" # The company/user creating the invoice
  belongs_to :contractor, class_name: "User", optional: true # The contractor being invoiced

  has_many :invoice_line_items, dependent: :destroy

  accepts_nested_attributes_for :invoice_line_items, allow_destroy: true

  validates :creator, presence: true

  # Status: draft, sent, paid, etc.
  enum status: { draft: 0, sent: 1, paid: 2, cancelled: 3 }

  def total_amount_cents
    invoice_line_items.sum(:amount_cents)
  end
end
