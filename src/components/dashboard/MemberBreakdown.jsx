import { formatCurrency } from '../../lib/utils'

export function MemberBreakdown({ data, total }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Per Anggota</h3>
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-900 mb-4">Per Anggota</h3>

      <div className="space-y-4">
        {data.map((member, index) => {
          const percentage = total > 0 ? (member.amount / total) * 100 : 0

          return (
            <div key={member.userId}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {member.displayName}
                </span>
                <span className="text-sm text-gray-500">
                  {member.count} transaksi
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-28 text-right">
                  {formatCurrency(member.amount)}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {percentage.toFixed(1)}% dari total
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
