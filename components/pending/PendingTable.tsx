"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/utils/format"
import { PendingResolver } from "./PendingResolver"
import { AlertCircle, Calendar, Receipt } from "lucide-react"

interface PendingItem {
    id: string
    order_date: string
    error_type: string | null
    intercars_id: string
    total_gross: number
    raw_comment: string | null
    plate_extraction_status: string
}

interface VehicleOption {
    id: string
    plate_number: string
}

export function PendingTable({ items, vehicles }: { items: PendingItem[], vehicles: VehicleOption[] }) {
    if (items.length === 0) {
        return (
            <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-xl border border-white/50 shadow-lg p-8 text-center">
                <p className="text-slate-500">Brak zamówień wymagających weryfikacji.</p>
            </div>
        )
    }

    return (
        <>
            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-xl border border-white/50 shadow-lg p-4 space-y-3"
                    >
                        {/* Header with date and order number */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">{formatDate(item.order_date)}</span>
                            </div>
                            <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {item.error_type || item.plate_extraction_status}
                            </span>
                        </div>

                        {/* Order ID and Amount */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-700">{item.intercars_id}</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">{formatCurrency(item.total_gross)}</span>
                        </div>

                        {/* Comment if exists */}
                        {item.raw_comment && (
                            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 line-clamp-2">
                                {item.raw_comment}
                            </p>
                        )}

                        {/* Action Button - Full Width for easy tap */}
                        <div className="pt-2">
                            <PendingResolver
                                orderId={item.id}
                                initialPlate={null}
                                vehicles={vehicles}
                                fullWidth
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block rounded-xl md:rounded-2xl bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-xl border border-white/50 shadow-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Nr Zamówienia</TableHead>
                            <TableHead>Błąd</TableHead>
                            <TableHead>Komentarz / Dane z importu</TableHead>
                            <TableHead className="text-right">Kwota</TableHead>
                            <TableHead className="text-right">Akcje</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{formatDate(item.order_date)}</TableCell>
                                <TableCell>{item.intercars_id}</TableCell>
                                <TableCell className="text-red-700 font-medium">{item.error_type || item.plate_extraction_status}</TableCell>
                                <TableCell className="max-w-[300px] truncate" title={item.raw_comment || ""}>
                                    {item.raw_comment || "-"}
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(item.total_gross)}</TableCell>
                                <TableCell className="text-right">
                                    <PendingResolver
                                        orderId={item.id}
                                        initialPlate={null}
                                        vehicles={vehicles}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}
