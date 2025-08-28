import * as React from "react";

const DialogContext = React.createContext({ open: false, onOpenChange: () => {} });

const Dialog = ({ children, open, onOpenChange }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

const DialogTrigger = React.forwardRef(({ className, children, open, onOpenChange, asChild, ...props }, ref) => {
  const ctx = React.useContext(DialogContext);
  const handleOpen = () => (onOpenChange || ctx.onOpenChange) && (onOpenChange || ctx.onOpenChange)(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick: handleOpen,
      ...props
    });
  }

  return (
    <div ref={ref} onClick={handleOpen} {...props}>
      {children}
    </div>
  );
});

const DialogContent = React.forwardRef(({ className, children, open, onOpenChange, onPointerDownOutside, ...props }, ref) => {
  const ctx = React.useContext(DialogContext);
  const isOpen = typeof open === "boolean" ? open : ctx.open;
  const close = () => (onOpenChange || ctx.onOpenChange) && (onOpenChange || ctx.onOpenChange)(false);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (onPointerDownOutside) {
      const event = { preventDefault: () => {} };
      onPointerDownOutside(event);
      if (event.defaultPrevented) return;
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleBackdropClick}
      />
      <div
        ref={ref}
        className={`relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className || ""}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});

const DialogHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`} {...props} />
);

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    {...props}
  />
));

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
));

DialogTrigger.displayName = "DialogTrigger";
DialogContent.displayName = "DialogContent";
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
