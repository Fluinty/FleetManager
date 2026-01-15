import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, ShoppingCart, AlertTriangle, Bell } from "lucide-react"

interface SummaryCardsProps {
    vehicleCount: number
    totalOrdersAmount: number
    pendingOrdersCount: number
    activeAlertsCount: number
}

import { formatCurrency } from "@/utils/format"

export function SummaryCards({
    vehicleCount,
    totalOrdersAmount,
    pendingOrdersCount,
    activeAlertsCount,
}: SummaryCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktywne Pojazdy</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{vehicleCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Zamówienia (Ten Miesiąc)</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalOrdersAmount)}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Oczekujące Weryfikacji</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktywne Alerty</CardTitle>
                    <Bell className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeAlertsCount}</div>
                </CardContent>
            </Card>
        </div>
    )
}
