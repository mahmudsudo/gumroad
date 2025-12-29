# frozen_string_literal: true

class InvoicesPresenter
  def initialize(user)
    @user = user
  end

  def index_props
    {
      invoices: @user.created_invoices.includes(:invoice_line_items, :contractor).map do |invoice|
        {
          id: invoice.external_id,
          contractor_name: invoice.contractor&.name,
          status: invoice.status,
          total_amount_cents: invoice.total_amount_cents,
          created_at: invoice.created_at.iso8601
        }
      end,
      contractors: User.where.not(id: @user.id).map { |user| { id: user.external_id, name: user.name } }
    }
  end

  def show_props(invoice)
    {
      invoice: {
        id: invoice.external_id,
        contractor_name: invoice.contractor&.name,
        status: invoice.status,
        description: invoice.description,
        total_amount_cents: invoice.total_amount_cents,
        created_at: invoice.created_at.iso8601,
        invoice_line_items: invoice.invoice_line_items.map do |item|
          {
            id: item.external_id,
            description: item.description,
            amount_cents: item.amount_cents,
            pr_link: item.pr_link,
            pr_data: item.pr_data,
            paid_by_invoice_id: item.paid_by_invoice_id&.external_id
          }
        end
      }
    }
  end

  def new_props
    {
      contractors: User.where.not(id: @user.id).map { |user| { id: user.external_id, name: user.name } }
    }
  end

  def edit_props(invoice)
    show_props(invoice).merge(new_props)
  end
end
