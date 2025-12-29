# frozen_string_literal: true

class GithubIntegration < Integration
  INTEGRATION_DETAILS = %w[organization_name organization_id access_token]
  INTEGRATION_DETAILS.each { |detail| attr_json_data_accessor detail }

  validates_presence_of :access_token

  def as_json(*)
    super.merge(organization_name:, organization_id:)
  end

  def self.is_enabled_for(purchase)
    purchase.find_enabled_integration(Integration::GITHUB).present?
  end

  def self.connection_settings
    super + %w[organization_name access_token]
  end

  def disconnect!
    # Revoke the token or just mark as disconnected
    update(access_token: nil)
    true
  end

  def same_connection?(integration)
    integration.type == type && integration.try(:organization_id) == organization_id
  end
end
