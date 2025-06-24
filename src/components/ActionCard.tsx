"use client";

import { PinContainer } from "@/components/ui/3d-pin";
import { QuickActionType } from "@/constants";

export function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <div className="h-[30rem] w-full flex items-center justify-center bg-transparent " 
     onClick={onClick} >
      <PinContainer
        title={action.title}
      >
        <div
          className="flex flex-col p-4 tracking-tight w-[15rem] h-[15rem] rounded-2xl border backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-card) 50%, transparent)",
            color: "var(--color-card-foreground)",
            borderColor: "var(--color-border, rgba(255, 255, 255, 0.1))",
          }}
        >
            <div
              className="text-xs"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <action.icon />
            </div>

          <div className="flex flex-col items-center justify-center flex-1 mt-4 space-y-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--color-foreground)" }}
            >
              {action.title}
            </div>

            <div className="h-20">
                {action.description}
            </div>

          </div>
        </div>
      </PinContainer>
    </div>
  );
}
