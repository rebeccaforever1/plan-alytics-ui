// src/components/ui/CustomerTable.tsx

const customers = [
  { name: 'Jill Carter', email: 'jill@example.com', total: 2184 },
  { name: 'Derek Ng', email: 'derek@example.com', total: 1992 },
  { name: 'Monica Reyes', email: 'monica@example.com', total: 1745 },
  { name: 'Tomas Castillo', email: 'tomas@example.com', total: 1390 },
  { name: 'Greta Liu', email: 'greta@example.com', total: 1202 },
]

export default function CustomerTable() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Top Customers</h3>
      <table className="w-full text-sm border">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-right p-2">Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2 text-right">${c.total.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
