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
import { Package, Calendar, ShoppingCart } from "lucide-react"

interface OrderInfo {
    id: string
    order_date: string
    intercars_id: string | null
}

interface Item {
    id: string
    name: string | null
    sku: string | null
    required_quantity: number | null
    total_gross: number | null
    orders: OrderInfo | OrderInfo[]
}

export function VehicleItemsHistory({ items }: { items: Item[] }) {
    // Helper to get order info from the nested relation
    const getOrderInfo = (item: Item): OrderInfo | null => {
        if (Array.isArray(item.orders)) {
            return item.orders[0] || null
        }
        return item.orders
    }

    // Mobile Card View
    const MobileCards = () => (
        <div className="space-y-3 md:hidden">
            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Brak przypisanych części.
                </div>
            ) : (
                items.map((item) => {
                    const order = getOrderInfo(item)
                    return (
                        <div
                            key={item.id}
                            className="rounded-xl bg-white/80 border border-white/50 shadow-sm p-4"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800 line-clamp-2">
                                            {item.name || "Bez nazwy"}
                                        </p>
                                        {item.sku && (
                                            <p className="text-xs text-slate-500">{item.sku}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-emerald-600">
                                        {formatCurrency(item.total_gross || 0)}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {item.required_quantity}x
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {order && (
                                    <>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(order.order_date)}
                                        </span>
                                        {order.intercars_id && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs">
                                                <ShoppingCart className="h-3 w-3" />
                                                #{order.intercars_id}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )

    // Desktop Table View
    const DesktopTable = () => (
        <div className="hidden md:block rounded-md border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Nr Zamówienia</TableHead>
                        <TableHead>Nazwa części</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Ilość</TableHead>
                        <TableHead className="text-right">Wartość</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                Brak przypisanych części.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map((item) => {
                            const order = getOrderInfo(item)
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        {order ? formatDate(order.order_date) : "-"}
                                    </TableCell>
                                    <TableCell>{order?.intercars_id || "-"}</TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={item.name || ""}>
                                        {item.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-slate-500">{item.sku || "-"}</TableCell>
                                    <TableCell className="text-right">{item.required_quantity || 0}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatCurrency(item.total_gross || 0)}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <>
            <MobileCards />
            <DesktopTable />
        </>
    )
}
