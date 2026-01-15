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
    return (
        <div className="rounded-md border bg-card text-card-foreground">
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
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                                Brak zamówień wymagających weryfikacji.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            // Flat structure now

                            return (
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
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
