# frozen_string_literal: true

module User::SocialGithub
  GITHUB_PROPERTIES = %w[github_user_id github_username github_access_token].freeze

  def self.included(base)
    base.extend(GithubClassMethods)
  end

  module GithubClassMethods
    # Find user by GitHub ID, Email or create one.
    def find_or_create_for_github_oauth!(data)
      info = data["info"]
      extra = data["extra"]["raw_info"]
      user = User.where(github_user_id: data["uid"]).first

      unless user
        email = info["email"]
        user = User.where(email:).first if EmailFormatValidator.valid?(email)
        unless user
          user = User.new
          user.provider = :github
          user.github_access_token = data["credentials"]["token"]
          user.password = Devise.friendly_token[0, 20]
          user.skip_confirmation!
          query_github(user, info, extra, new_user: true)
          user.save!
          if user.email.present?
            Purchase.where(email: user.email, purchaser_id: nil).each do |past_purchase|
              past_purchase.attach_to_user_and_card(user, nil, nil)
            end
          end
        end
      else
        query_github(user, info, extra)
        user.github_access_token = data["credentials"]["token"]
        user.save!
      end

      user
    end

    # Save GitHub data in DB
    def query_github(user, info, extra, new_user: false)
      return unless user

      user.github_user_id = extra["id"]
      user.github_username = info["nickname"]

      # don't set these properties if they already have values
      user.name ||= info["name"]
      user.bio ||= extra["bio"]
      user.username = user.github_username unless user.read_attribute(:username).present?
      user.username = nil unless user.valid?
      user.save
    end
  end
end
