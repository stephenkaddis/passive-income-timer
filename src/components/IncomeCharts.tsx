import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'
import { formatCurrency, type CurrencyCode } from '../utils/format'
import type { Period } from '../App'

const PERIOD_LABELS: Record<Period, string> = {
  daily: 'Today',
  weekly: 'Week',
  monthly: 'Month',
  yearly: 'Year',
}

const PERIOD_ORDER: Period[] = ['daily', 'weekly', 'monthly', 'yearly']
const CHART_COLORS = ['#00c853', '#00a843', '#008c39', '#006b34']

export interface HistoryPoint {
  t: number
  value: number
}

interface IncomeChartsProps {
  history: HistoryPoint[]
  amounts: Record<Period, number>
  selectedPeriod: Period
  currency: CurrencyCode
  valid: boolean
}

export function IncomeCharts({
  history,
  amounts,
  selectedPeriod,
  currency,
  valid,
}: IncomeChartsProps) {
  const now = history.length ? history[history.length - 1].t : Date.now()
  const lineData = history.map((p) => ({
    sec: ((now - p.t) / 1000).toFixed(1),
    amount: p.value,
    full: formatCurrency(p.value, currency, { decimals: 5 }),
  }))

  const barData = PERIOD_ORDER.map((p) => ({
    period: PERIOD_LABELS[p],
    amount: valid ? amounts[p] : 0,
    fill: CHART_COLORS[PERIOD_ORDER.indexOf(p)],
  }))

  const maxBar = Math.max(...barData.map((d) => d.amount), 0.001)
  const maxLine = Math.max(...lineData.map((d) => d.amount), 0.001)

  return (
    <section className="income-charts" aria-label="Earnings charts">
      <div className="chart-card chart-live">
        <h3 className="chart-title">Live growth (last 30s)</h3>
        <p className="chart-subtitle">{PERIOD_LABELS[selectedPeriod]} — earnings over time</p>
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={lineData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--input-border)" opacity={0.5} />
              <XAxis
                dataKey="sec"
                stroke="var(--text-muted)"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${v}s`}
              />
              <YAxis
                stroke="var(--text-muted)"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(2))}
                domain={[0, maxLine * 1.05]}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 8,
                }}
                labelStyle={{ color: 'var(--text-muted)' }}
                formatter={(value: number) => [formatCurrency(value, currency, { decimals: 5 }), 'Earned']}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload ? `${payload[0].payload.sec}s` : ''
                }
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#earningsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card chart-bars">
        <h3 className="chart-title">Earnings by period</h3>
        <p className="chart-subtitle">Compare daily, weekly, monthly, yearly</p>
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--input-border)" opacity={0.5} />
              <XAxis
                type="number"
                stroke="var(--text-muted)"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(2)}`)}
                domain={[0, maxBar * 1.1]}
              />
              <YAxis type="category" dataKey="period" stroke="var(--text-muted)" tick={{ fontSize: 11 }} width={50} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 8,
                }}
                formatter={(value: number) => [formatCurrency(value, currency, { decimals: 5 }), 'Earned']}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} minPointSize={4}>
                {barData.map((entry) => (
                  <Cell key={entry.period} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
