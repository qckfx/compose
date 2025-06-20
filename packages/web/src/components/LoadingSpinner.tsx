import React, { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  states?: string[];
  cycleTime?: number;
  overlay?: boolean;
  loop?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  states = [],
  cycleTime = 3500,
  overlay = false,
  loop = true,
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (states.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentState((prev) => {
        const next = prev + 1;
        return loop ? next % states.length : Math.min(next, states.length - 1);
      });
    }, cycleTime);

    return () => clearInterval(interval);
  }, [states, cycleTime, loop]);

  const spinnerContent = (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
      <p className="mt-4 text-muted-foreground">
        {states.length > 0 ? states[currentState] : "Loading..."}
      </p>
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-background/10 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
