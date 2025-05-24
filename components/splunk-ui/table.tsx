"use client"

import type React from "react"

interface TableProps {
  children: React.ReactNode
  stripeRows?: boolean
}

interface TableHeadProps {
  children: React.ReactNode
}

interface TableBodyProps {
  children: React.ReactNode
}

interface TableRowProps {
  children: React.ReactNode
}

interface TableCellProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

interface TableHeadCellProps {
  children: React.ReactNode
}

export function Table({ children, stripeRows }: TableProps) {
  return (
    <div className="splunk-table-container">
      <table className={`splunk-table ${stripeRows ? "stripe-rows" : ""}`}>{children}</table>
    </div>
  )
}

Table.Head = function TableHead({ children }: TableHeadProps) {
  return <thead className="splunk-table-head">{children}</thead>
}

Table.Body = function TableBody({ children }: TableBodyProps) {
  return <tbody className="splunk-table-body">{children}</tbody>
}

Table.Row = function TableRow({ children }: TableRowProps) {
  return <tr className="splunk-table-row">{children}</tr>
}

Table.Cell = function TableCell({ children, style }: TableCellProps) {
  return (
    <td className="splunk-table-cell" style={style}>
      {children}
    </td>
  )
}

Table.HeadCell = function TableHeadCell({ children }: TableHeadCellProps) {
  return <th className="splunk-table-head-cell">{children}</th>
}
