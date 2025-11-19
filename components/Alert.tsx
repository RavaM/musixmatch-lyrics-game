"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGameStore } from "@/lib/store/game";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

export const Alert = ({
  pendingHref,
  setPendingHref,
}: {
  pendingHref: string | null;
  setPendingHref: Dispatch<SetStateAction<string | null>>;
}) => {
  const router = useRouter();
  const { resetGame } = useGameStore();

  const handleConfirmLeave = () => {
    if (!pendingHref) return;
    // We consider the game abandoned and reset it
    resetGame();
    router.push(pendingHref);
    setPendingHref(null);
  };

  const handleCancelLeave = () => {
    setPendingHref(null);
  };

  return (
    <AlertDialog
      open={!!pendingHref}
      onOpenChange={(open) => {
        if (!open) setPendingHref(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave the game?</AlertDialogTitle>
          <AlertDialogDescription>
            If you leave now, you&apos;ll lose your current progress in this
            round. Are you sure you want to go to a different page?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelLeave}>
            Stay here
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmLeave}>
            Leave game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
