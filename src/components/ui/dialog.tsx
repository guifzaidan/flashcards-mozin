"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn("fixed inset-0 isolate z-50", className)}
      style={{
        backgroundColor: "rgba(19, 50, 102, 0.35)",
        backdropFilter: "blur(2px)",
      }}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn("dialog-popup outline-none", className)}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "calc(100% - 2rem)",
          maxWidth: "448px",
        }}
        {...props}
      >
        {/* Card com estilo cartoon */}
        <div
          className="relative bg-white w-full p-5 overflow-y-auto"
          style={{
            border: "3px solid #133266",
            borderRadius: "20px",
            boxShadow: "6px 6px 0 #133266",
            maxHeight: "90vh",
          }}
        >
          {children}

          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              render={
                <button
                  className="btn-cartoon absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-white text-[#133266]"
                  style={{
                    border: "2px solid #133266",
                    boxShadow: "2px 2px 0 #133266",
                  }}
                />
              }
            >
              <X size={14} strokeWidth={2.5} />
              <span className="sr-only">Fechar</span>
            </DialogPrimitive.Close>
          )}
        </div>
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 pr-8 mb-4", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-black text-xl text-[#133266]", className)}
      style={{ fontFamily: "var(--font-caveat)" }}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-gray-500 font-medium", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, children, ...props }: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
