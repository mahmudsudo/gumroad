import { usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { SettingPage } from "$app/parsers/settings";

import { Button } from "$app/components/Button";
import { Layout } from "$app/components/Settings/Layout";

type IntegrationsPageProps = {
  settings_pages: SettingPage[];
  github_connected: boolean;
  github_organization: string | null;
};

export default function IntegrationsPage() {
  const props = cast<IntegrationsPageProps>(usePage().props);

  const connectGitHub = () => {
    window.location.href = "/auth/github?scope=repo,read:org";
  };

  const disconnectGitHub = () => {
    // TODO: Implement disconnect endpoint
    window.location.href = "/settings/integrations/disconnect_github";
  };

  return (
    <Layout currentPage="integrations" pages={props.settings_pages}>
      <section className="p-4! md:p-8!">
        <header>
          <h2>GitHub Integration</h2>
        </header>
        <fieldset>
          {props.github_connected ? (
            <div>
              <p>Connected to GitHub organization: {props.github_organization}</p>
              <Button onClick={disconnectGitHub} color="secondary">
                Disconnect GitHub
              </Button>
            </div>
          ) : (
            <div>
              <p>Connect your GitHub organization to enable PR tracking in invoices.</p>
              <Button onClick={connectGitHub}>
                Connect GitHub Organization
              </Button>
            </div>
          )}
        </fieldset>
      </section>
    </Layout>
  );
}
