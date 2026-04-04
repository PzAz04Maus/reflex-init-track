import React from "react";
import "mathlive";
declare global {
    namespace JSX {
        interface IntrinsicElements {
            "math-field": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                value?: string;
                placeholder?: string;
            };
        }
    }
}
export default function App(): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=calc.d.ts.map