import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, success, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-14 px-4 bg-background border rounded-xl",
              "text-base text-foreground placeholder:text-muted-foreground",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-12",
              (success || error) && "pr-12",
              error && "border-destructive focus:ring-destructive",
              success && "border-success focus:ring-success",
              !error && !success && "border-border",
              className
            )}
            {...props}
          />
          {(success || error) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {success && <Check className="w-5 h-5 text-success" />}
              {error && <X className="w-5 h-5 text-destructive" />}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
