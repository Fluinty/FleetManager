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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

interface OrderItem {
    id: string
    name: string | null
    sku: string | null
    required_quantity: number | null
    total_net: number | null
}

interface Order {
    id: string
    order_date: string
    intercars_id: string | null
    total_gross: number
    status: string
    description: string | null
    vehicle_id: string | null
    branches?: { name: string } | { name: string }[] | null
    vehicles?: { plate_number: string } | null
    order_items?: OrderItem[]
}

export function OrdersTable({ orders }: { orders: Order[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedRows(newExpanded)
    }

    const handleSort = (field: string) => {
        const params = new URLSearchParams(searchParams)
        const currentSort = params.get("sort")
        const currentDir = params.get("dir")

        if (currentSort === field) {
            params.set("dir", currentDir === "asc" ? "desc" : "asc")
        } else {
            params.set("sort", field)
            params.set("dir", "desc")
        }
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="rounded-md border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => handleSort('order_date')} className="-ml-4 h-8">
                                Data <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Nr Zamówienia</TableHead>
                        <TableHead>Pojazd</TableHead>
                        <TableHead>Oddział</TableHead>
                        <TableHead>Opis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                            <Button variant="ghost" onClick={() => handleSort('total_gross')} className="-ml-4 h-8">
                                Kwota <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center h-24 text-gray-500">
                                Brak zamówień spełniających kryteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => {
                            const branchName = Array.isArray(order.branches)
                                ? order.branches[0]?.name
                                : order.branches?.name
                            const plate = Array.isArray(order.vehicles)
                                ? order.vehicles[0]?.plate_number
                                : order.vehicles?.plate_number
                            const isExpanded = expandedRows.has(order.id)

                            return (
                                <>
                                    <TableRow key={order.id} className={cn("cursor-pointer hover:bg-muted/50", isExpanded && "bg-muted/50")} onClick={() => toggleRow(order.id)}>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatDate(order.order_date)}</TableCell>
                                        <TableCell>{order.intercars_id || "-"}</TableCell>
                                        <TableCell>{plate || order.vehicle_id || "-"}</TableCell>
                                        <TableCell>{branchName}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={order.description || ""}>{order.description || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'MATCHED' ? 'default' : 'secondary'}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(order.total_gross)}</TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="p-0 bg-muted/30">
                                                <div className="p-4">
                                                    <h4 className="font-semibold mb-2 text-sm">Pozycje zamówienia:</h4>
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Nazwa</TableHead>
                                                                <TableHead>SKU</TableHead>
                                                                <TableHead className="text-right">Ilość</TableHead>
                                                                <TableHead className="text-right">Wartość Netto</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {order.order_items && order.order_items.length > 0 ? (
                                                                order.order_items.map((item) => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell>{item.name}</TableCell>
                                                                        <TableCell>{item.sku}</TableCell>
                                                                        <TableCell className="text-right">{item.required_quantity}</TableCell>
                                                                        <TableCell className="text-right">{formatCurrency(item.total_net || 0)}</TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">Brak pozycji</TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
