import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        placeholder?: string;
      };
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        placeholder?: string;
      };
    }
  }
}

export {};