"use client"

import React from "react"
import { useRef, useEffect } from "react"

interface PopoverProps {
  open: boolean
  onRequestClose: () => void
  children: React.ReactNode
}

interface PopoverTriggerProps {
  children: React.ReactNode
}

interface PopoverBodyProps {
  children: React.ReactNode
}

export function Popover({ open, onRequestClose, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onRequestClose()
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onRequestClose])

  const trigger = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === PopoverTrigger,
  )
  const body = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === PopoverBody,
  )

  return (
    <div className="splunk-popover" ref={popoverRef}>
      {trigger}
      {open && <div className="splunk-popover-content">{body}</div>}
    </div>
  )
}

function PopoverTrigger({ children }: PopoverTriggerProps) {
  return <>{children}</>
}

function PopoverBody({ children }: PopoverBodyProps) {
  return <>{children}</>
}

Popover.Trigger = PopoverTrigger
Popover.Body = PopoverBody
