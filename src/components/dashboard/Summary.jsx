import { formatCurrency } from '../../lib/utils'

export function Summary({ total, prevTotal, transactionCount }) {
  const diff = total - prevTotal
  const percentChange = prevTotal > 0 ? ((diff / prevTotal) * 100).toFixed(1) : 0
  const isIncrease = diff > 0

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
      <div className="text-sm opacity-80 mb-1">Total Pengeluaran</div>
      <div className="text-3xl font-bold mb-4">{formatCurrency(total)}</div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {prevTotal > 0 && (
            <>
              <span className={`flex items-center gap-1 ${isIncrease ? 'text-red-200' : 'text-green-200'}`}>
                {isIncrease ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {Math.abs(percentChange)}%
              </span>
              <span className="opacity-70">vs bulan lalu</span>
            </>
          )}
        </div>
        <div className="opacity-70">
          {transactionCount} transaksi
        </div>
      </div>
    </div>
  )
}
