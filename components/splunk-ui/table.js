"use client"

export function Table({ children, stripeRows }) {
  return (
    <div className="splunk-table-container">
      <table className={`splunk-table ${stripeRows ? "stripe-rows" : ""}`}>{children}</table>
    </div>
  )
}

function TableHead({ children }) {
  return <thead className="splunk-table-head">{children}</thead>
}

function TableBody({ children }) {
  return <tbody className="splunk-table-body">{children}</tbody>
}

function TableRow({ children }) {
  return <tr className="splunk-table-row">{children}</tr>
}

function TableCell({ children, style }) {
  return (
    <td className="splunk-table-cell" style={style}>
      {children}
    </td>
  )
}

function TableHeadCell({ children }) {
  return <th className="splunk-table-head-cell">{children}</th>
}

Table.Head = TableHead
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.HeadCell = TableHeadCell
