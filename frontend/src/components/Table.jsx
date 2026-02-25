export default function Table({ data }) {
  return (
    <div className="bg-white rounded shadow p-4">

      <h3 className="font-semibold mb-3">
        Recent Allocations
      </h3>

      <table className="w-full text-sm">

        <thead>
          <tr className="text-left border-b">

            <th>Name</th>
            <th>Roll</th>
            <th>Room</th>
            <th>Status</th>

          </tr>
        </thead>

        <tbody>

          {data.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No records
              </td>
            </tr>
          )}

          {data.map((item) => (
            <tr key={item._id} className="border-b">

              <td>{item.name}</td>
              <td>{item.roll}</td>
              <td>{item.room}</td>

              <td>
                <span className="text-green-600">
                  {item.status}
                </span>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}