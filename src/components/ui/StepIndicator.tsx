import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                isCompleted ? "bg-blue-600 border-blue-600 text-white" :
                  isActive ? "border-blue-600 text-blue-600 bg-white" :
                    "border-slate-200 text-slate-400 bg-white"
              )}>
                {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <div className="mt-1.5 text-center">
                <div className={cn("text-xs font-semibold", isActive ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400")}>{step.label}</div>
                {step.description && <div className="text-xs text-slate-400">{step.description}</div>}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-0.5 w-16 mx-3 mt-[-18px]", isCompleted ? "bg-blue-600" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
