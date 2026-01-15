"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/utils/format"
import { differenceInDays, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Vehicle {
    id: string
    plate_number: string
    brand: string | null
    model: string | null
    production_year: number | null
    branch_id?: string | null
    next_inspection_date: string | null
    next_insurance_date: string | null
    is_active: boolean | null
    branches?: { name: string } | { name: string }[] | null // Handle array or object
}

export function VehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSort = (field: string) => {
        const params = new URLSearchParams(searchParams)
        const currentSort = params.get("sort")
        const currentDir = params.get("dir")

        if (currentSort === field) {
            params.set("dir", currentDir === "asc" ? "desc" : "asc")
        } else {
            params.set("sort", field)
            params.set("dir", "asc")
        }
        router.push(`?${params.toString()}`)
    }

    const getExpiryColor = (dateStr: string | null) => {
        if (!dateStr) return ""
        const days = differenceInDays(parseISO(dateStr), new Date())
        if (days < 0) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" // Expired
        if (days < 30) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800"
        if (days < 60) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
        return "text-gray-600 dark:text-gray-400"
    }

    return (
        <div className="rounded-md border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">
                            <Button variant="ghost" onClick={() => handleSort('plate_number')} className="-ml-4 h-8">
                                Nr Rej. <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Marka</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Rocznik</TableHead>
                        <TableHead>Oddział</TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('next_inspection_date')} className="-ml-4 h-8">
                                Przegląd <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('next_insurance_date')} className="-ml-4 h-8">
                                Ubezpieczenie <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center h-24 text-gray-500">
                                Brak pojazdów spełniających kryteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        vehicles.map((vehicle) => {
                            const branchName = Array.isArray(vehicle.branches)
                                ? vehicle.branches[0]?.name
                                : vehicle.branches?.name

                            return (
                                <TableRow key={vehicle.id} className={cn(!vehicle.is_active && "text-gray-500 bg-gray-50 dark:bg-gray-900/50")}>
                                    <TableCell className="font-medium">{vehicle.plate_number}</TableCell>
                                    <TableCell>{vehicle.brand}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell>{vehicle.production_year}</TableCell>
                                    <TableCell>{branchName}</TableCell>
                                    <TableCell>
                                        <div className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-transparent",
                                            getExpiryColor(vehicle.next_inspection_date)
                                        )}>
                                            {formatDate(vehicle.next_inspection_date)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-transparent",
                                            getExpiryColor(vehicle.next_insurance_date)
                                        )}>
                                            {formatDate(vehicle.next_insurance_date)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/vehicles/${vehicle.id}`}>Szczegóły</Link>
                                        </Button>
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
