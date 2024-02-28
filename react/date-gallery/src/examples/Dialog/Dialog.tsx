import React, {
  useEffect,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  useRef,
} from "react";

type Props = {
  children: ReactNode;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
  onClose: () => void;
};

export function Dialog({ children, onClose, onKeyDown }: Props) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [dialogRef]);

  function closeDialog(event: MouseEvent<any>) {
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      event.target.nodeName === "DIALOG"
    ) {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
      onClose();
    }
  }

  return (
    <dialog ref={dialogRef} onClick={closeDialog} onKeyDown={onKeyDown}>
      {children}
    </dialog>
  );
}
