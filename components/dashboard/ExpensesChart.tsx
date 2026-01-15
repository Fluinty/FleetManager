"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/utils/format"

interface ExpenseData {
    month: string
    amount: number
}

export function ExpensesChart({ data }: { data: ExpenseData[] }) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Wydatki na części (Ostatnie 6 miesięcy)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value} zł`}
                        />
                        <Tooltip
                            formatter={(value: number | undefined) => [formatCurrency(value), "Kwota"]}
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", color: "#f3f4f6" }}
                            itemStyle={{ color: "#f3f4f6" }}
                            labelStyle={{ color: "#9ca3af" }}
                        />
                        <Bar
                            dataKey="amount"
                            fill="#adfa1d" // Bright green, fits dark/modern theme? Maybe distinct color
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
