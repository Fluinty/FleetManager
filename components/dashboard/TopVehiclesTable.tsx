"use client"

import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/utils/format"
import { ExternalLink } from "lucide-react"

interface TopVehicle {
    id: string
    plate_number: string
    brand: string
    model: string
    branch_name: string
    total_spent: number
    order_count: number
}

export function TopVehiclesTable({ vehicles }: { vehicles: TopVehicle[] }) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-xl border border-white/50 shadow-lg shadow-purple-500/5 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="p-6 border-b border-purple-100/50">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Top 10 Pojazdów (Ten Miesiąc)
                </h3>
                <p className="text-sm text-slate-500">Najwyższe wydatki na części</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nr Rej.</TableHead>
                        <TableHead>Pojazd</TableHead>
                        <TableHead>Oddział</TableHead>
                        <TableHead className="text-right">Wydatki</TableHead>
                        <TableHead className="text-right">Zamówienia</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-400">
                                Brak danych za ten miesiąc
                            </TableCell>
                        </TableRow>
                    ) : (
                        vehicles.map((vehicle, index) => (
                            <TableRow
                                key={vehicle.plate_number}
                                className="group cursor-pointer"
                            >
                                <TableCell className="font-semibold">
                                    <Link href={`/vehicles/${vehicle.id}`} className="flex items-center gap-2 text-purple-700 hover:text-purple-900">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
                                            {index + 1}
                                        </span>
                                        {vehicle.plate_number}
                                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/vehicles/${vehicle.id}`} className="block">
                                        {vehicle.brand} {vehicle.model}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/vehicles/${vehicle.id}`} className="block">
                                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                            {vehicle.branch_name}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/vehicles/${vehicle.id}`} className="block font-semibold text-emerald-600">
                                        {formatCurrency(vehicle.total_spent)}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/vehicles/${vehicle.id}`} className="block">
                                        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                                            {vehicle.order_count}
                                        </span>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
