import * as React from "react";

const TooltipProvider = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

const Tooltip = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={`z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 ${className || ""}`}
    {...props}
  />
));

TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
