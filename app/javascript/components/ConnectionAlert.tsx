import * as React from "react";

type ConnectionAlertProps = {
  message: string;
  actionUrl?: string;
  actionText?: string;
};

export default function ConnectionAlert({ message, actionUrl, actionText }: ConnectionAlertProps) {
  return (
    <div className="alert alert-warning">
      <p>{message}</p>
      {actionUrl && actionText && (
        <a href={actionUrl} className="btn btn-sm btn-primary">
          {actionText}
        </a>
      )}
    </div>
  );
}
