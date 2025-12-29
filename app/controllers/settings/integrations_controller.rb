# frozen_string_literal: true

class Settings::IntegrationsController < Settings::BaseController
  before_action :authorize

  def show
    @title = "Integrations"
    render inertia: "Settings/Integrations/Show", props: settings_presenter.integrations_props
  end
end
