import * as React from "react";

type PrLinkInputProps = {
  value: string;
  onChange: (value: string) => void;
  onPrDataChange?: (data: any) => void;
};

export default function PrLinkInput({ value, onChange, onPrDataChange }: PrLinkInputProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleBlur = async () => {
    if (!value || !value.match(/github\.com\/.*\/.*\/pull\/\d+/)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/internal/github/pr-info?url=${encodeURIComponent(value)}`);
      if (response.ok) {
        const data = await response.json();
        onPrDataChange?.(data);
      }
    } catch (error) {
      console.error("Failed to fetch PR data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="https://github.com/owner/repo/pull/123"
        className="form-input"
      />
      {isLoading && <span className="ml-2">Loading PR data...</span>}
    </div>
  );
}
