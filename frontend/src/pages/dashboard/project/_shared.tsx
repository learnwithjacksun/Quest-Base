import type { ReactNode } from "react";
import { useOutletContext } from "react-router-dom";
import type { Project } from "@/components/dashboard";

type ProjectOutletContext = {
  project: Project;
};

export function useProject() {
  return useOutletContext<ProjectOutletContext>();
}

type FeaturePageProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function FeaturePage({ title, description, children }: FeaturePageProps) {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl lg:text-2xl font-semibold text-main">{title}</h1>
        <p className="text-sm text-muted max-w-2xl">{description}</p>
      </div>
      {children}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-secondary p-4 space-y-1">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-xl font-semibold text-main">{value}</p>
    </div>
  );
}

type EmptyPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyPanel({ title, description, action }: EmptyPanelProps) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-secondary/40 px-6 py-12 text-center space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-main">{title}</h2>
        <p className="text-sm text-muted max-w-md mx-auto">{description}</p>
      </div>
      {action}
    </div>
  );
}
