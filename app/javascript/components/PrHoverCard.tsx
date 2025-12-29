import * as React from "react";

type PrData = {
  title: string;
  state: string;
  merged: boolean;
  bounty_amount: number | null;
  author: string;
  created_at: string;
};

type PrHoverCardProps = {
  prData: PrData;
  children: React.ReactNode;
};

export default function PrHoverCard({ prData, children }: PrHoverCardProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsVisible(true), 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsVisible(false), 300);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div className="absolute z-10 p-4 bg-white border rounded shadow-lg max-w-sm">
          <h4 className="font-bold">{prData.title}</h4>
          <p>Author: {prData.author}</p>
          <p>State: {prData.state}</p>
          <p>Created: {new Date(prData.created_at).toLocaleDateString()}</p>
          {prData.bounty_amount && (
            <p>Bounty: ${prData.bounty_amount}</p>
          )}
        </div>
      )}
    </div>
  );
}
