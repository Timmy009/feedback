"use client"

import React, { useRef, useEffect } from "react"

export function Popover({ open, onRequestClose, children }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
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

function PopoverTrigger({ children }) {
  return <>{children}</>
}

function PopoverBody({ children }) {
  return <>{children}</>
}

Popover.Trigger = PopoverTrigger
Popover.Body = PopoverBody
