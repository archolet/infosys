'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:disabled:bg-zinc-800 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-700'
          } ${className} `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
