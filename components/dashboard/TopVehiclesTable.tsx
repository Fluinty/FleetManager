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
        <div className="rounded-2xl glass-premium overflow-hidden transition-all duration-300 card-hover">
            <div className="p-4 md:p-6 border-b border-slate-100">
                <h3 className="text-base md:text-lg font-bold gradient-text font-[var(--font-space-grotesk)]">
                    Top 10 Pojazdów (Ten Miesiąc)
                </h3>
                <p className="text-xs md:text-sm text-slate-500">Najwyższe wydatki na części</p>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-100 hover:bg-slate-50/50">
                            <TableHead className="text-slate-500">Nr Rej.</TableHead>
                            <TableHead className="text-slate-500">Pojazd</TableHead>
                            <TableHead className="text-slate-500">Oddział</TableHead>
                            <TableHead className="text-right text-slate-500">Wydatki</TableHead>
                            <TableHead className="text-right text-slate-500">Zamówienia</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.length === 0 ? (
                            <TableRow className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell colSpan={5} className="text-center h-24 text-slate-400">
                                    Brak danych za ten miesiąc
                                </TableCell>
                            </TableRow>
                        ) : (
                            vehicles.map((vehicle, index) => (
                                <TableRow
                                    key={vehicle.plate_number}
                                    className="group cursor-pointer border-slate-100 hover:bg-white/60 transition-colors"
                                >
                                    <TableCell className="font-semibold">
                                        <Link href={`/vehicles/${vehicle.id}`} className="flex items-center gap-2 text-slate-700 hover:text-teal-700 transition-colors">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-bold shadow-md shadow-teal-500/20">
                                                {index + 1}
                                            </span>
                                            {vehicle.plate_number}
                                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-500" />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/vehicles/${vehicle.id}`} className="block text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {vehicle.brand} {vehicle.model}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/vehicles/${vehicle.id}`} className="block">
                                            <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                                {vehicle.branch_name}
                                            </span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/vehicles/${vehicle.id}`} className="block font-semibold text-teal-600">
                                            {formatCurrency(vehicle.total_spent)}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/vehicles/${vehicle.id}`} className="block">
                                            <span className="px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100">
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
        </div>
    )
}
