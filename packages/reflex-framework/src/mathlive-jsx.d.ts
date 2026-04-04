import type { DetailedHTMLProps, HTMLAttributes } from "react";

// TypeScript declaration for math-field custom element in JSX

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        placeholder?: string;
      };
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        placeholder?: string;
      };
    }
  }
}

export {};
