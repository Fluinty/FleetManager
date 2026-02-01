"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { formatCurrency } from "@/utils/format"

interface BranchSpending {
    branch_code: string
    branch_name: string
    spending: number
}

interface SpendingByBranchChartProps {
    data: BranchSpending[]
}

const COLORS = [
    "#14b8a6", // teal-500
    "#0ea5e9", // sky-500
    "#8b5cf6", // violet-500
    "#f59e0b", // amber-500
    "#ec4899", // pink-500
]

export function SpendingByBranchChart({ data }: SpendingByBranchChartProps) {
    if (data.length === 0) {
        return (
            <div className="rounded-xl md:rounded-2xl bg-white/80 border border-slate-200/60 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Wydatki wg Oddziału</h3>
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                    Brak danych dla wybranego okresu
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl md:rounded-2xl bg-white/80 border border-slate-200/60 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Wydatki wg Oddziału</h3>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <XAxis
                            type="number"
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="branch_name"
                            width={100}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#334155', fontSize: 13, fontWeight: 500 }}
                        />
                        <Tooltip
                            formatter={(value: number) => [formatCurrency(value), "Wydatki"]}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Bar dataKey="spending" radius={[0, 8, 8, 0]} maxBarSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={entry.branch_code} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
