"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/utils/format"
import { differenceInDays, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Wrench } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { deleteDevice } from "@/app/actions/devices"
import { EditDeviceModal } from "./EditDeviceModal"

interface Vehicle {
    id: string
    plate_number: string
    brand: string | null
    model: string | null
    vehicle_category: string | null
}

interface Branch {
    id: string
    name: string
}

interface Device {
    id: string
    udt_number: string
    device_type: "lift" | "forklift"
    name: string | null
    vehicle_id: string | null
    branch_id: string
    last_inspection_date: string | null
    decision_expiry_date: string | null
    next_inspection_date: string | null
    notes: string | null
    is_active: boolean
    vehicles: Vehicle | Vehicle[] | null
    branches: Branch | Branch[] | null
}

interface ActiveVehicle {
    id: string
    plate_number: string
    brand: string | null
    model: string | null
    branch_id: string | null
}

interface DevicesTableProps {
    devices: Device[]
    vehicles: ActiveVehicle[]
    branches: Branch[]
    isAdmin: boolean
}

export function DevicesTable({ devices, vehicles, branches, isAdmin }: DevicesTableProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()
    const [editingDevice, setEditingDevice] = useState<Device | null>(null)

    const getVehicle = (device: Device): Vehicle | null => {
        if (!device.vehicles) return null
        return Array.isArray(device.vehicles) ? device.vehicles[0] : device.vehicles
    }

    const getBranchName = (device: Device): string => {
        if (!device.branches) return "-"
        const branch = Array.isArray(device.branches) ? device.branches[0] : device.branches
        return branch?.name || "-"
    }

    const getInspectionBadgeColor = (dateStr: string | null) => {
        if (!dateStr) return "bg-gray-100 text-gray-500"
        const days = differenceInDays(parseISO(dateStr), new Date())
        if (days < 0) return "bg-red-50 text-red-600"
        if (days <= 30) return "bg-amber-50 text-amber-600"
        return "bg-emerald-50 text-emerald-600"
    }

    const getDeviceTypeBadge = (type: string) => {
        if (type === "lift") {
            return (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700">
                    Winda
                </span>
            )
        }
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700">
                Wózek widłowy
            </span>
        )
    }

    const getCategoryBadge = (vehicle: Vehicle | null) => {
        if (!vehicle?.vehicle_category) return null
        switch (vehicle.vehicle_category) {
            case "truck":
                return (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700">
                        🟠 Ciężarówka
                    </span>
                )
            case "van":
                return (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700">
                        🔵 Bus
                    </span>
                )
            case "car":
                return (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700">
                        ⚪ Osobówka
                    </span>
                )
            default:
                return null
        }
    }

    const handleDelete = (deviceId: string) => {
        startTransition(async () => {
            const result = await deleteDevice(deviceId)
            if (result.error) {
                toast({
                    title: "Błąd",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Sukces",
                    description: "Urządzenie zostało usunięte.",
                })
                router.refresh()
            }
        })
    }

    // Mobile Card View
    const MobileCards = () => (
        <div className="space-y-3 md:hidden">
            {devices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Brak urządzeń spełniających kryteria.
                </div>
            ) : (
                devices.map((device) => {
                    const vehicle = getVehicle(device)
                    const branchName = getBranchName(device)

                    return (
                        <div
                            key={device.id}
                            className={cn(
                                "block p-4 rounded-xl bg-white/80 border border-white/50 shadow-sm",
                                !device.is_active && "opacity-60"
                            )}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-lg flex items-center justify-center",
                                        device.device_type === "lift"
                                            ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                                            : "bg-gradient-to-br from-amber-500 to-orange-500"
                                    )}>
                                        <Wrench className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{device.udt_number}</p>
                                        <p className="text-sm text-slate-500">
                                            {device.device_type === "lift" && vehicle
                                                ? `${vehicle.plate_number} - ${vehicle.brand || ""} ${vehicle.model || ""}`
                                                : device.name || "-"}
                                        </p>
                                    </div>
                                </div>
                                {getDeviceTypeBadge(device.device_type)}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                    {branchName}
                                </span>
                                {device.device_type === "lift" && getCategoryBadge(vehicle)}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs bg-gray-50 text-gray-600">
                                    <span>Ostatnie: {formatDate(device.last_inspection_date)}</span>
                                </div>
                                <div className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs",
                                    getInspectionBadgeColor(device.next_inspection_date)
                                )}>
                                    <span>Następne: {formatDate(device.next_inspection_date)}</span>
                                </div>
                            </div>

                            {isAdmin && (
                                <div className="flex gap-2 mt-3 pt-3 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingDevice(device)}
                                    >
                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                        Edytuj
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                Usuń
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Usunąć urządzenie?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Czy na pewno chcesz usunąć urządzenie {device.udt_number}? Tej operacji nie można cofnąć.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(device.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Usuń
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
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
                        <TableHead>Nr UDT</TableHead>
                        <TableHead>Typ</TableHead>
                        <TableHead>Pojazd / Nazwa</TableHead>
                        <TableHead>Kategoria</TableHead>
                        <TableHead>Oddział</TableHead>
                        <TableHead>Ostatnie badanie</TableHead>
                        <TableHead>Następne badanie</TableHead>
                        {isAdmin && <TableHead className="text-right">Akcje</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devices.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={isAdmin ? 8 : 7} className="text-center h-24 text-gray-500">
                                Brak urządzeń spełniających kryteria.
                            </TableCell>
                        </TableRow>
                    ) : (
                        devices.map((device) => {
                            const vehicle = getVehicle(device)
                            const branchName = getBranchName(device)

                            return (
                                <TableRow key={device.id} className={cn(!device.is_active && "text-gray-500 bg-gray-50")}>
                                    <TableCell className="font-medium">{device.udt_number}</TableCell>
                                    <TableCell>{getDeviceTypeBadge(device.device_type)}</TableCell>
                                    <TableCell>
                                        {device.device_type === "lift" && vehicle ? (
                                            <Link
                                                href={`/vehicles/${vehicle.id}`}
                                                className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                                            >
                                                {vehicle.plate_number}
                                            </Link>
                                        ) : (
                                            <span>{device.name || "-"}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {device.device_type === "lift" ? getCategoryBadge(vehicle) : "-"}
                                    </TableCell>
                                    <TableCell>{branchName}</TableCell>
                                    <TableCell>{formatDate(device.last_inspection_date)}</TableCell>
                                    <TableCell>
                                        <div className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                            getInspectionBadgeColor(device.next_inspection_date)
                                        )}>
                                            {formatDate(device.next_inspection_date)}
                                        </div>
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingDevice(device)}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Usunąć urządzenie?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Czy na pewno chcesz usunąć urządzenie {device.udt_number}? Tej operacji nie można cofnąć.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Anuluj</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(device.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Usuń
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    )}
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
            {editingDevice && (
                <EditDeviceModal
                    device={editingDevice}
                    vehicles={vehicles}
                    branches={branches}
                    open={!!editingDevice}
                    onOpenChange={(open) => {
                        if (!open) setEditingDevice(null)
                    }}
                />
            )}
        </>
    )
}
