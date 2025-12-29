# frozen_string_literal: true

class GithubService
  BASE_URL = "https://api.github.com"

  def initialize(access_token = nil)
    @access_token = access_token
  end

  def pull_request_info(repo_full_name, pr_number)
    url = "#{BASE_URL}/repos/#{repo_full_name}/pulls/#{pr_number}"
    response = make_request(url)
    JSON.parse(response.body) if response.success?
  end

  def issue_info(repo_full_name, issue_number)
    url = "#{BASE_URL}/repos/#{repo_full_name}/issues/#{issue_number}"
    response = make_request(url)
    JSON.parse(response.body) if response.success?
  end

  def user_orgs
    url = "#{BASE_URL}/user/orgs"
    response = make_request(url)
    JSON.parse(response.body) if response.success?
  end

  private

  def make_request(url)
    headers = { "Accept" => "application/vnd.github.v3+json" }
    headers["Authorization"] = "token #{@access_token}" if @access_token

    HTTParty.get(url, headers: headers)
  end
end
