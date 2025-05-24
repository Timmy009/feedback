"use client"

interface WaitSpinnerProps {
  size?: "small" | "medium" | "large"
}

export function WaitSpinner({ size = "medium" }: WaitSpinnerProps) {
  return <div className={`splunk-wait-spinner splunk-wait-spinner-${size}`}></div>
}
