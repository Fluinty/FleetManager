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

interface Order {
    id: string
    order_date: string
    intercars_id: string | null
    total_gross: number
    status: string
    raw_comment: string | null
}

export function VehicleOrdersHistory({ orders }: { orders: Order[] }) {
    return (
        <div className="rounded-md border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Nr Zamówienia (InterCars)</TableHead>
                        <TableHead>Opis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Kwota</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                Brak historii zamówień.
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{formatDate(order.order_date)}</TableCell>
                                <TableCell>{order.intercars_id || "-"}</TableCell>
                                <TableCell className="truncate max-w-[200px]">{order.raw_comment || "-"}</TableCell>
                                <TableCell>
                                    <Badge variant={order.status === 'confirmed' ? 'default' : 'secondary'}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(order.total_gross)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
