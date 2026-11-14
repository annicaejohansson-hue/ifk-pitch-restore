import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
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

type UnsavedCheckoutGuardProps = {
  enabled: boolean;
};

const UnsavedCheckoutGuard = ({ enabled }: UnsavedCheckoutGuardProps) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      enabled && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (!enabled) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled]);

  const open = enabled && blocker.state === "blocked";

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && blocker.state === "blocked") {
          blocker.reset();
        }
      }}
    >
      <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Lämna kassan?</AlertDialogTitle>
          <AlertDialogDescription>
            Det du har fyllt i försvinner om du lämnar sidan utan att fullborda
            köpet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:space-x-0">
          <AlertDialogCancel className="h-auto min-h-11 whitespace-normal">
            Stanna kvar
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-auto min-h-11 whitespace-normal"
            onClick={() => {
              if (blocker.state === "blocked") blocker.proceed();
            }}
          >
            Lämna sidan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedCheckoutGuard;
