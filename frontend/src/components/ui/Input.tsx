import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, required, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className={cn("text-sm font-medium text-gray-700", required && "after:content-['*'] after:ml-0.5 after:text-error-main")}>
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <div className="absolute left-3 text-gray-500 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        className={cn(
                            "w-full px-4 py-2 border rounded-md text-base transition-all",
                            "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                            "disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60",
                            error ? "border-error-main focus:ring-error-main/20 focus:border-error-main" : "border-gray-300",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 text-gray-500 pointer-events-none">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {helperText && !error && (
                    <p className="text-xs text-gray-500">{helperText}</p>
                )}
                {error && (
                    <p className="text-xs text-error-main">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
