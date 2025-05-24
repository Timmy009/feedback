"use client"

import { useEffect } from "react"

export function Modal({ open, onRequestClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <div className="splunk-modal-overlay" onClick={onRequestClose}>
      <div className="splunk-modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title }) {
  return (
    <div className="splunk-modal-header">
      <h2 className="splunk-modal-title">{title}</h2>
    </div>
  )
}

function ModalBody({ children }) {
  return <div className="splunk-modal-body">{children}</div>
}

function ModalFooter({ children }) {
  return <div className="splunk-modal-footer">{children}</div>
}

Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter
