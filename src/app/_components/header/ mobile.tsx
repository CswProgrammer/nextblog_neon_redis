"use client";

import { X } from "lucide-react";
import { type FC, type KeyboardEventHandler, type MouseEventHandler, useCallback } from "react";
import { createPortal } from "react-dom";

import { Button } from "../shadcn/ui/button";
import { cn } from "../shadcn/utils";
import { HeaderLogo } from "./logo";
import $styles from "./mobile.module.css";
import { MobileNav } from "./nav";

const Modal: FC<{
  close: MouseEventHandler<HTMLDivElement>;
  open: boolean;
}> = ({ close, open }) => {
  const noAction = useCallback<KeyboardEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
  }, []);
  
  return (
    <div
      className={cn($styles.modal, { [$styles.open]: open })}
      role="button"
      tabIndex={0}
      onClick={close}
      onKeyDown={noAction}
    ></div>
  );
};

export const MobileHeader: FC<{
  open: boolean;
  setOpen: (value: boolean) => void;
}> = (props) => {
  const { open, setOpen } = props;
  
  const close = useCallback<MouseEventHandler<HTMLDivElement | HTMLButtonElement>>((e) => {
    e.preventDefault();
    setOpen(false);
  }, []);
  
  // 添加阻止事件冒泡
  const stopPropagation = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    e.stopPropagation();
  }, []);
  
  return (
    <>
      <div className={cn($styles.side, { [$styles.open]: open })}>
        <div className={$styles.top}>
          <HeaderLogo />
          <Button
            variant="outline"
            size="icon"
            className={cn("tw-btn-icon-transparent")}
            onClick={close}
          >
            <X />
          </Button>
        </div>
        <div 
          className={$styles.content}
          onClick={stopPropagation} // 阻止事件冒泡
        >
          <MobileNav />
        </div>
      </div>
      
      {createPortal(<Modal close={close} open={open} />, document.body)}
    </>
  );
};
