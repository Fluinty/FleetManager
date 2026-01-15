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
                {vehicles.map((vehicle) => (
                    <TableRow
                        key={vehicle.plate_number}
                        className="cursor-pointer hover:bg-muted/50"
                    >
                        <TableCell className="font-medium">
                            <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                                {vehicle.plate_number}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                                {vehicle.brand} {vehicle.model}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                                {vehicle.branch_name}
                            </Link>
                        </TableCell>
                        <TableCell className="text-right">
                            <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                                {formatCurrency(vehicle.total_spent)}
                            </Link>
                        </TableCell>
                        <TableCell className="text-right">
                            <Link href={`/vehicles/${vehicle.id}`} className="block w-full">
                                {vehicle.order_count}
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
