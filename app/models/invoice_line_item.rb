# frozen_string_literal: true

class InvoiceLineItem < ApplicationRecord
  include Deletable

  belongs_to :invoice
  belongs_to :paid_by_invoice, class_name: "Invoice", optional: true # For tracking if this PR was already paid

  validates :invoice, presence: true
  validates :description, presence: true
  validates :amount_cents, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # For PR links
  def pr_link?
    pr_link.present? && pr_link.start_with?('https://github.com/') && pr_link.include?('/pull/')
  end

  def pr_number
    return nil unless pr_link?
    match = pr_link.match(%r{https://github\.com/([^/]+)/([^/]+)/pull/(\d+)})
    match[3] if match
  end

  def repo_full_name
    return nil unless pr_link?
    match = pr_link.match(%r{https://github\.com/([^/]+)/([^/]+)/pull/(\d+)})
    "#{match[1]}/#{match[2]}" if match
  end

  def pr_data
    return nil unless pr_link?

    # Try to get access token from creator's GitHub integration or user
    access_token = invoice.creator.github_access_token
    service = GithubService.new(access_token)
    pr_info = service.pull_request_info(repo_full_name, pr_number)
    return pr_info if pr_info

    # If not found as PR, try as issue
    service.issue_info(repo_full_name, pr_number)
  end

  def bounty_amount
    return nil unless pr_data

    # Look for bounty labels like "bounty: $100" or "$100"
    labels = pr_data["labels"] || []
    bounty_label = labels.find { |label| label["name"].match?(/bounty|\$/) }
    return nil unless bounty_label

    match = bounty_label["name"].match(/\$?(\d+(?:\.\d{2})?)/)
    match[1].to_f * 100 if match # Convert to cents
  end

  def merged?
    pr_data&.dig("merged")
  end

  def closed?
    pr_data&.dig("state") == "closed"
  end

  def title
    pr_data&.dig("title")
  end

  def html_url
    pr_data&.dig("html_url")
  end
end
