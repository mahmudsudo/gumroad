import * as React from "react";

type PaidBadgeProps = {
  paid: boolean;
};

export default function PaidBadge({ paid }: PaidBadgeProps) {
  if (!paid) return null;

  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded">
      Paid
    </span>
  );
}
