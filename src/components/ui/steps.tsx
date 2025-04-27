
import React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  }[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row justify-between", className)}>
      {steps.map((step, index) => {
        const status = 
          index === currentStep
            ? "current"
            : index < currentStep
            ? "complete"
            : "upcoming";

        return (
          <div 
            key={step.id}
            className={cn(
              "flex items-center",
              index !== steps.length - 1 ? "flex-1" : "",
              index !== 0 ? "mt-4 sm:mt-0" : ""
            )}
          >
            <StepIndicator status={status} icon={step.icon}>
              {index + 1}
            </StepIndicator>
            
            <div className="ml-4 flex flex-col flex-1">
              <div className={cn(
                "text-sm font-medium",
                status === "current" ? "text-primary" : 
                status === "complete" ? "text-primary" : 
                "text-muted-foreground"
              )}>
                {step.label}
              </div>
              
              {index !== steps.length - 1 && (
                <div className="hidden sm:block h-0.5 mt-2 bg-muted flex-1" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface StepIndicatorProps {
  status: "upcoming" | "current" | "complete";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function StepIndicator({ status, children, icon }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        "w-8 h-8 text-sm font-medium",
        status === "upcoming" ? "border-2 border-muted text-muted-foreground" :
        status === "current" ? "bg-primary text-primary-foreground" :
        "bg-primary/20 text-primary"
      )}
    >
      {icon || children}
    </div>
  );
}
