import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/utils/format"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PendingOrder {
    id: string
    created_at: string
    amount: number
    error_reason: string // e.g. "brak numeru rejestracyjnego"
}

export function RecentPendingList({ orders }: { orders: PendingOrder[] }) {
    return (
        <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Do weryfikacji</CardTitle>
                <Button variant="ghost" asChild className="text-sm">
                    <Link href="/pending">Zobacz wszystkie</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {orders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Brak oczekujących zamówień.</p>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {formatCurrency(order.amount)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-red-500 text-sm">
                                    {order.error_reason}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
