// components/ui/tabs.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsRootProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
};

const TabsContext = React.createContext<{
  value: string;
  setValue: (v: string) => void;
}>({ value: "", setValue: () => {} });

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsRootProps) {
  const [internal, setInternal] = React.useState(defaultValue || "");
  const v = value ?? internal;
  const setValue = (nv: string) => {
    setInternal(nv);
    onValueChange?.(nv);
  };
  return (
    <TabsContext.Provider value={{ value: v, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex gap-2", className)} {...props} />;
}

export function TabsTrigger({
  value,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: active, setValue } = React.useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "px-3 py-1 rounded-xl border text-sm",
        isActive ? "bg-primary text-white border-primary" : "bg-white text-ink-700 border-ink-100",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: active } = React.useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className} {...props} />;
}
