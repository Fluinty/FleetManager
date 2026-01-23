"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface ExpensesChartProps {
    data: { month: string; amount: number }[]
}

export function ExpensesChart({ data }: ExpensesChartProps) {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

    return (
        <div className="rounded-2xl glass-premium p-4 md:p-6 transition-all duration-300 card-hover">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
                <div>
                    <h3 className="text-lg font-bold gradient-text font-[var(--font-space-grotesk)]">
                        Wydatki na części
                    </h3>
                    <p className="text-sm text-slate-500">Ostatnie 6 miesięcy</p>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium self-start sm:self-auto border border-teal-100 shadow-sm">
                    <TrendingUp className="h-4 w-4" />
                    {totalAmount.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                </div>
            </div>
            <ResponsiveContainer width="100%" height={200} className="md:!h-[280px]">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                            padding: '12px 16px',
                            color: '#1e293b'
                        }}
                        labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
                        formatter={(value) => [`${(value ?? 0).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł`, 'Kwota']}
                        itemStyle={{ color: '#0D9488' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#0D9488"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        dot={{ fill: '#ffffff', strokeWidth: 2, stroke: '#0D9488', r: 4 }}
                        activeDot={{ r: 6, fill: '#0D9488', stroke: '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
