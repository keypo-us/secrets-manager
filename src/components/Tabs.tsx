import React from "react";

type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  selectedTab: string;
  setSelectedTab: (key: string) => void;
};

export function Tabs({ tabs, selectedTab, setSelectedTab }: TabsProps) {
  return (
    <nav className="flex flex-col gap-2 w-full">
      {tabs.map((tab) => {
        const isActive = selectedTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`w-full px-4 py-2 rounded-md text-left bg-background tracking-wider font-bold transition-colors
              ${isActive
                ? "text-foreground"
                : "text-primary hover:text-foreground"}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
} 