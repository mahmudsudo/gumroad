# frozen_string_literal: true

class AddGithubFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :github_user_id, :string
    add_column :users, :github_username, :string
    add_column :users, :github_access_token, :string
    add_index :users, :github_user_id
  end
end
