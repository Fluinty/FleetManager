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
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/utils/format"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { acknowledgeAlert } from "@/app/actions/acknowledge-alert"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

// Alert type labels in Polish with corresponding badge variants
const ALERT_TYPE_CONFIG: Record<string, { label: string; variant: "destructive" | "warning" | "default" }> = {
    budget_exceeded: { label: "Budżet przekroczony", variant: "destructive" },
}

function getAlertTypeLabel(alertType: string) {
    return ALERT_TYPE_CONFIG[alertType] || { label: alertType, variant: "default" as const }
}

interface Alert {
    id: string
    created_at: string
    alert_type: string
    actual_value: number
    threshold_value: number
    vehicle_id: string
    vehicles?: {
        plate_number: string
        brand: string
        model: string
    } | null
}

function AcknowledgeButton({ alertId, onClick }: { alertId: string; onClick: (e: React.MouseEvent) => void }) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleAcknowledge = async (e: React.MouseEvent) => {
        onClick(e) // Prevent row navigation
        setLoading(true)
        try {
            await acknowledgeAlert(alertId)
            toast({ title: "Alert zatwierdzony", description: "Alert został pomyślnie schowany." })
        } catch {
            toast({ variant: "destructive", title: "Błąd", description: "Nie udało się zatwierdzić alertu." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="outline" size="sm" onClick={handleAcknowledge} disabled={loading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Zatwierdź
        </Button>
    )
}

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
    return (
        <div className="rounded-md border bg-card text-card-foreground">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Pojazd</TableHead>
                        <TableHead>Typ Alertu</TableHead>
                        <TableHead className="text-right">Wartość / Limit</TableHead>
                        <TableHead className="text-right">Akcje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {alerts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                Brak aktywnych alertów.
                            </TableCell>
                        </TableRow>
                    ) : (
                        alerts.map((alert) => {
                            const vehicle = Array.isArray(alert.vehicles) ? alert.vehicles[0] : alert.vehicles
                            return (
                                <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        <Link href={`/vehicles/${alert.vehicle_id}`} className="block w-full">
                                            {formatDate(alert.created_at)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/vehicles/${alert.vehicle_id}`} className="block w-full">
                                            {vehicle
                                                ? `${vehicle.plate_number} (${vehicle.brand})`
                                                : "Pojazd usunięty"}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/vehicles/${alert.vehicle_id}`} className="block w-full">
                                            <Badge variant={getAlertTypeLabel(alert.alert_type).variant}>
                                                {getAlertTypeLabel(alert.alert_type).label}
                                            </Badge>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/vehicles/${alert.vehicle_id}`} className="block w-full">
                                            <span className="font-bold text-red-700">{formatCurrency(alert.actual_value)}</span>
                                            <span className="text-muted-foreground mx-1">/</span>
                                            <span>{formatCurrency(alert.threshold_value)}</span>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <AcknowledgeButton alertId={alert.id} onClick={(e) => e.stopPropagation()} />
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
