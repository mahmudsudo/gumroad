# frozen_string_literal: true

class Api::GithubController < ApplicationController
  before_action :authenticate_user!

  def pr_info
    url = params[:url]
    return render json: { error: "Invalid URL" }, status: :bad_request unless url&.match?(%r{https://github\.com/([^/]+)/([^/]+)/pull/(\d+)})

    match = url.match(%r{https://github\.com/([^/]+)/([^/]+)/pull/(\d+)})
    repo_full_name = "#{match[1]}/#{match[2]}"
    pr_number = match[3]

    access_token = current_user.github_access_token
    return render json: { error: "GitHub not connected" }, status: :unauthorized unless access_token

    service = GithubService.new(access_token)
    pr_data = service.pull_request_info(repo_full_name, pr_number)

    if pr_data
      render json: pr_data
    else
      render json: { error: "PR not found" }, status: :not_found
    end
  end
end
