"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { differenceInDays, parseISO, format } from "date-fns"
import { cn } from "@/lib/utils"
import { Wrench } from "lucide-react"

interface Device {
    id: string
    udt_number: string
    device_type: string
    next_inspection_date: string | null
    last_inspection_date: string | null
}

interface VehicleDevicesProps {
    devices: Device[]
}

export function VehicleDevices({ devices }: VehicleDevicesProps) {
    const getInspectionColor = (dateStr: string | null) => {
        if (!dateStr) return "text-gray-500"
        const days = differenceInDays(parseISO(dateStr), new Date())
        if (days < 0) return "text-red-600 font-semibold"
        if (days < 30) return "text-yellow-600 font-semibold"
        return "text-green-600"
    }

    const getInspectionBadgeColor = (dateStr: string | null) => {
        if (!dateStr) return "bg-gray-100 text-gray-500"
        const days = differenceInDays(parseISO(dateStr), new Date())
        if (days < 0) return "bg-red-100 text-red-700"
        if (days < 30) return "bg-yellow-100 text-yellow-700"
        return "bg-green-100 text-green-700"
    }

    const formatDeviceType = (type: string) => {
        switch (type) {
            case 'lift': return 'Winda'
            case 'forklift': return 'Wózek widłowy'
            default: return type
        }
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Wrench className="h-5 w-5 text-teal-600" />
                    Urządzenia UDT
                </CardTitle>
            </CardHeader>
            <CardContent>
                {devices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Brak przypisanych urządzeń</p>
                ) : (
                    <div className="space-y-2">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-800">
                                            {device.udt_number}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {formatDeviceType(device.device_type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-slate-500">Następny przegląd</span>
                                    <span className={cn(
                                        "text-sm rounded-full px-2 py-0.5",
                                        getInspectionBadgeColor(device.next_inspection_date)
                                    )}>
                                        {device.next_inspection_date
                                            ? format(parseISO(device.next_inspection_date), 'dd.MM.yyyy')
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
