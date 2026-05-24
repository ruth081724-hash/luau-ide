import React from "react";
import { Files, Code2, Monitor, Terminal as TerminalIcon } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'explorer', icon: Files, label: 'Files' },
    { id: 'editor', icon: Code2, label: 'Editor' },
    { id: 'preview', icon: Monitor, label: 'Preview' },
    { id: 'terminal', icon: TerminalIcon, label: 'Console' },
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 w-full h-14 bg-card/90 backdrop-blur-xl border-t border-white/10 flex z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 relative flex flex-col items-center justify-center transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
            <Icon size={20} className="mb-1" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
