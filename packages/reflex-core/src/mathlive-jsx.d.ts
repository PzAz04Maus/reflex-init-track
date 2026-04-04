// TypeScript declaration for math-field custom element in JSX

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        value?: string;
        placeholder?: string;
      };
    }
  }
}

export {};
