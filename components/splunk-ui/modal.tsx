"use client"

import type React from "react"
import { useEffect } from "react"

interface ModalProps {
  open: boolean
  onRequestClose: () => void
  children: React.ReactNode
}

interface ModalHeaderProps {
  title: string
}

interface ModalBodyProps {
  children: React.ReactNode
}

interface ModalFooterProps {
  children: React.ReactNode
}

export function Modal({ open, onRequestClose, children }: ModalProps) {
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

Modal.Header = function ModalHeader({ title }: ModalHeaderProps) {
  return (
    <div className="splunk-modal-header">
      <h2 className="splunk-modal-title">{title}</h2>
    </div>
  )
}

Modal.Body = function ModalBody({ children }: ModalBodyProps) {
  return <div className="splunk-modal-body">{children}</div>
}

Modal.Footer = function ModalFooter({ children }: ModalFooterProps) {
  return <div className="splunk-modal-footer">{children}</div>
}
