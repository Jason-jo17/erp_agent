import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md",
                secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm",
                success: "bg-success-main text-white hover:bg-success-dark",
                danger: "bg-error-main text-white hover:bg-error-dark",
                outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
                ghost: "hover:bg-gray-100 text-gray-700",
                link: "text-primary-500 underline-offset-4 hover:underline"
            },
            size: {
                xs: "h-8 px-3 text-xs",
                sm: "h-9 px-4 text-sm",
                md: "h-10 px-6 text-base",
                lg: "h-12 px-8 text-lg",
                xl: "h-14 px-10 text-xl"
            }
        },
        defaultVariants: {
            variant: "primary",
            size: "md"
        }
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);
Button.displayName = "Button";
