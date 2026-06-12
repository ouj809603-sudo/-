import React from "react";
import { Sparkles, Sliders, Play, Grid } from "lucide-react";

interface ProjectFilterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts: {
    all: number;
    gemini: number;
    mixboard: number;
    grok: number;
  };
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  activeTab,
  setActiveTab,
  counts
}) => {
  const tabs = [
    { id: "all", label: "전체 보기", count: counts.all, icon: Grid, color: "text-blue-500 group-hover:text-blue-600" },
    { id: "Gemini", label: "Gemini", count: counts.gemini, icon: Sparkles, color: "text-indigo-500" },
    { id: "Mixboard", label: "Mixboard", count: counts.mixboard, icon: Sliders, color: "text-sky-500" },
    { id: "Grok", label: "Grok", count: counts.grok, icon: Play, color: "text-rose-500" }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 my-8">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 font-bold"
                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <IconComponent className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : tab.color}`} />
            <span>{tab.label}</span>
            <span
              className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-white text-blue-650"
                  : "bg-slate-100 text-slate-400 group-hover:text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
