import { Bot } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AskAlumnexButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-30 gap-2 rounded-full bg-ai text-ai-foreground shadow-lift hover:bg-ai/90"
        >
          <Bot className="size-4" /> Ask ALUMNEX AI
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ALUMNEX AI</DialogTitle>
          <DialogDescription>
            The assistant answers questions like “which alumni can help me break into AI research?” using your
            institution&apos;s own verified network.
          </DialogDescription>
        </DialogHeader>
        <div className="ai-panel p-4 text-sm">
          <p className="font-medium">Arriving in the next build stage</p>
          <p className="mt-1 text-muted-foreground">
            The matching engine behind it is already live — every mentor recommendation on this dashboard is scored and
            explained by it.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
