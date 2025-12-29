# frozen_string_literal: true

class InvoicesController < ApplicationController
  before_action :authenticate_user!

  def index
    @invoices = current_user.created_invoices.includes(:invoice_line_items, :contractor)
    @contractors = User.where.not(id: current_user.id)
    @presenter = InvoicesPresenter.new(current_user)
    render inertia: "Invoices/Index", props: @presenter.index_props
  end

  def show
    @invoice = current_user.created_invoices.includes(:invoice_line_items, :contractor).find(params[:id])
    # Preload PR data for line items
    @invoice.invoice_line_items.each do |item|
      item.pr_data if item.pr_link?
    end
    @presenter = InvoicesPresenter.new(current_user)
    render inertia: "Invoices/Show", props: @presenter.show_props(@invoice)
  end

  def new
    @invoice = current_user.created_invoices.build
    @invoice.invoice_line_items.build
    @contractors = User.where.not(id: current_user.id)
    @presenter = InvoicesPresenter.new(current_user)
    render inertia: "Invoices/New", props: @presenter.new_props
  end

  def create
    @invoice = current_user.created_invoices.build(invoice_params)
    if @invoice.save
      redirect_to @invoice, notice: 'Invoice created successfully.'
    else
      @contractors = User.where.not(id: current_user.id)
      @presenter = InvoicesPresenter.new(current_user)
      render inertia: "Invoices/New", props: @presenter.new_props
    end
  end

  def edit
    @invoice = current_user.created_invoices.includes(:invoice_line_items, :contractor).find(params[:id])
    @contractors = User.where.not(id: current_user.id)
    @presenter = InvoicesPresenter.new(current_user)
    render inertia: "Invoices/Edit", props: @presenter.edit_props(@invoice)
  end

  def update
    @invoice = current_user.created_invoices.find(params[:id])
    if @invoice.update(invoice_params)
      redirect_to @invoice, notice: 'Invoice updated successfully.'
    else
      @contractors = User.where.not(id: current_user.id)
      @presenter = InvoicesPresenter.new(current_user)
      render inertia: "Invoices/Edit", props: @presenter.edit_props(@invoice)
    end
  end

  def destroy
    @invoice = current_user.created_invoices.find(params[:id])
    @invoice.destroy
    redirect_to invoices_path, notice: 'Invoice deleted successfully.'
  end

  private

  def invoice_params
    params.require(:invoice).permit(:contractor_id, :description, :status, invoice_line_items_attributes: [:id, :description, :amount_cents, :pr_link, :_destroy])
  end
end
