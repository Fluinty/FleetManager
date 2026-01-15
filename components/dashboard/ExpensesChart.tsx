"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface ExpensesChartProps {
    data: { month: string; amount: number }[]
}

export function ExpensesChart({ data }: ExpensesChartProps) {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

    return (
        <div className="rounded-2xl bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-xl border border-white/50 shadow-lg shadow-purple-500/5 p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Wydatki na części
                    </h3>
                    <p className="text-sm text-slate-500">Ostatnie 6 miesięcy</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {totalAmount.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
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
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(124, 58, 237, 0.2)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px rgba(124, 58, 237, 0.15)',
                            padding: '12px 16px'
                        }}
                        labelStyle={{ color: '#1e293b', fontWeight: 'bold', marginBottom: '4px' }}
                        formatter={(value: number) => [`${value.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł`, 'Kwota']}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7c3aed"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                        dot={{ fill: '#7c3aed', strokeWidth: 2, stroke: '#fff', r: 4 }}
                        activeDot={{ r: 6, fill: '#7c3aed', stroke: '#fff', strokeWidth: 3 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
