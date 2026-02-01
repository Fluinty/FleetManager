import { formatCurrency } from "@/utils/format"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface BranchStats {
    branch_code: string
    branch_name: string
    vehicles: number
    orders: number
    spending: number
    avgPerVehicle: number
}

interface BranchComparisonTableProps {
    data: BranchStats[]
}

export function BranchComparisonTable({ data }: BranchComparisonTableProps) {
    if (data.length === 0) {
        return (
            <div className="rounded-xl md:rounded-2xl bg-white/80 border border-slate-200/60 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Porównanie Oddziałów</h3>
                <div className="h-[150px] flex items-center justify-center text-slate-500">
                    Brak danych dla wybranego okresu
                </div>
            </div>
        )
    }

    // Calculate totals
    const totals = data.reduce((acc, row) => ({
        vehicles: acc.vehicles + row.vehicles,
        orders: acc.orders + row.orders,
        spending: acc.spending + row.spending
    }), { vehicles: 0, orders: 0, spending: 0 })

    return (
        <div className="rounded-xl md:rounded-2xl bg-white/80 border border-slate-200/60 p-6 shadow-lg overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Porównanie Oddziałów</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-200">
                            <TableHead className="text-slate-600">Oddział</TableHead>
                            <TableHead className="text-right text-slate-600">Pojazdy</TableHead>
                            <TableHead className="text-right text-slate-600">Zamówienia</TableHead>
                            <TableHead className="text-right text-slate-600">Wydatki</TableHead>
                            <TableHead className="text-right text-slate-600">Śr. na Pojazd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.branch_code} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-800">
                                    {row.branch_name}
                                    <span className="ml-2 text-xs text-slate-400">({row.branch_code})</span>
                                </TableCell>
                                <TableCell className="text-right text-slate-600">{row.vehicles}</TableCell>
                                <TableCell className="text-right text-slate-600">{row.orders}</TableCell>
                                <TableCell className="text-right font-medium text-emerald-600">
                                    {formatCurrency(row.spending)}
                                </TableCell>
                                <TableCell className="text-right text-slate-600">
                                    {formatCurrency(row.avgPerVehicle)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Totals Row */}
                        <TableRow className="border-t-2 border-slate-200 bg-slate-50/50 font-semibold">
                            <TableCell className="text-slate-800">Łącznie</TableCell>
                            <TableCell className="text-right text-slate-700">{totals.vehicles}</TableCell>
                            <TableCell className="text-right text-slate-700">{totals.orders}</TableCell>
                            <TableCell className="text-right text-emerald-700">
                                {formatCurrency(totals.spending)}
                            </TableCell>
                            <TableCell className="text-right text-slate-700">
                                {totals.vehicles > 0
                                    ? formatCurrency(totals.spending / totals.vehicles)
                                    : "—"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
