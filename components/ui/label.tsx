// components/ui/label.tsx
import * as React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "label", ...props }: LabelProps) {
  return <label className={className} {...props} />;
}
export default Label;
