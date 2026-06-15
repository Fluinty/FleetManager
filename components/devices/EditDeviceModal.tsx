"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Pencil } from "lucide-react"
import { updateDevice } from "@/app/actions/devices"

interface Vehicle {
    id: string
    plate_number: string
    brand: string | null
    model: string | null
    vehicle_category: string | null
}

interface ActiveVehicle {
    id: string
    plate_number: string
    brand: string | null
    model: string | null
    branch_id: string | null
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

interface EditDeviceModalProps {
    device: Device
    vehicles: ActiveVehicle[]
    branches: Branch[]
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditDeviceModal({ device, vehicles, branches, open, onOpenChange }: EditDeviceModalProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const [deviceType, setDeviceType] = useState<"lift" | "forklift">(device.device_type)
    const [udtNumber, setUdtNumber] = useState(device.udt_number)
    const [vehicleId, setVehicleId] = useState(device.vehicle_id || "")
    const [name, setName] = useState(device.name || "")
    const [branchId, setBranchId] = useState(device.branch_id)
    const [lastInspectionDate, setLastInspectionDate] = useState(device.last_inspection_date || "")
    const [decisionExpiryDate, setDecisionExpiryDate] = useState(device.decision_expiry_date || "")
    const [nextInspectionDate, setNextInspectionDate] = useState(device.next_inspection_date || "")

    // Reset form when device changes
    useEffect(() => {
        setDeviceType(device.device_type)
        setUdtNumber(device.udt_number)
        setVehicleId(device.vehicle_id || "")
        setName(device.name || "")
        setBranchId(device.branch_id)
        setLastInspectionDate(device.last_inspection_date || "")
        setDecisionExpiryDate(device.decision_expiry_date || "")
        setNextInspectionDate(device.next_inspection_date || "")
    }, [device])

    const handleVehicleChange = (selectedVehicleId: string) => {
        setVehicleId(selectedVehicleId)
        const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
        if (selectedVehicle?.branch_id) {
            setBranchId(selectedVehicle.branch_id)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!udtNumber.trim()) {
            toast({ title: "Błąd", description: "Nr UDT jest wymagany.", variant: "destructive" })
            return
        }

        if (deviceType === "lift" && !vehicleId) {
            toast({ title: "Błąd", description: "Wybierz pojazd.", variant: "destructive" })
            return
        }

        if (deviceType === "forklift" && !name.trim()) {
            toast({ title: "Błąd", description: "Nazwa wózka jest wymagana.", variant: "destructive" })
            return
        }

        if (!branchId) {
            toast({ title: "Błąd", description: "Wybierz oddział.", variant: "destructive" })
            return
        }

        startTransition(async () => {
            const result = await updateDevice(device.id, {
                udt_number: udtNumber.trim(),
                device_type: deviceType,
                name: deviceType === "forklift" ? name.trim() : null,
                vehicle_id: deviceType === "lift" ? vehicleId : null,
                branch_id: branchId,
                last_inspection_date: lastInspectionDate,
                decision_expiry_date: decisionExpiryDate,
                next_inspection_date: nextInspectionDate,
            })

            if (result.error) {
                toast({
                    title: "Błąd",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Sukces",
                    description: "Urządzenie zostało zaktualizowane.",
                })
                onOpenChange(false)
                router.refresh()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="h-5 w-5 text-teal-500" />
                        Edytuj urządzenie UDT
                    </DialogTitle>
                    <DialogDescription>
                        Edytuj dane urządzenia {device.udt_number}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Device Type Toggle */}
                    <div>
                        <Label>Typ urządzenia *</Label>
                        <div className="flex gap-2 mt-1.5">
                            <Button
                                type="button"
                                variant={deviceType === "lift" ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setDeviceType("lift")
                                    setName("")
                                }}
                                className={deviceType === "lift" ? "bg-blue-600 hover:bg-blue-700" : ""}
                            >
                                Winda
                            </Button>
                            <Button
                                type="button"
                                variant={deviceType === "forklift" ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setDeviceType("forklift")
                                    setVehicleId("")
                                }}
                                className={deviceType === "forklift" ? "bg-amber-600 hover:bg-amber-700" : ""}
                            >
                                Wózek widłowy
                            </Button>
                        </div>
                    </div>

                    {/* UDT Number */}
                    <div>
                        <Label htmlFor="editUdtNumber">Nr UDT *</Label>
                        <Input
                            id="editUdtNumber"
                            value={udtNumber}
                            onChange={(e) => setUdtNumber(e.target.value)}
                            placeholder="np. N123456789"
                        />
                    </div>

                    {/* Vehicle selector (lifts only) */}
                    {deviceType === "lift" && (
                        <div>
                            <Label>Pojazd *</Label>
                            <Select value={vehicleId} onValueChange={handleVehicleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wybierz pojazd" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehicles.map((v) => (
                                        <SelectItem key={v.id} value={v.id}>
                                            {v.plate_number} — {v.brand} {v.model}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Name input (forklifts only) */}
                    {deviceType === "forklift" && (
                        <div>
                            <Label htmlFor="editDeviceName">Nazwa wózka *</Label>
                            <Input
                                id="editDeviceName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="np. Linde H50"
                            />
                        </div>
                    )}

                    {/* Branch selector */}
                    <div>
                        <Label>Oddział *</Label>
                        <Select
                            value={branchId}
                            onValueChange={setBranchId}
                            disabled={deviceType === "lift" && !!vehicleId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Wybierz oddział" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {deviceType === "lift" && vehicleId && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Oddział ustawiony automatycznie na podstawie pojazdu
                            </p>
                        )}
                    </div>

                    {/* Date inputs */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="editLastInspectionDate">Ostatnie badanie</Label>
                            <Input
                                id="editLastInspectionDate"
                                type="date"
                                value={lastInspectionDate}
                                onChange={(e) => setLastInspectionDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editDecisionExpiryDate">Termin decyzji</Label>
                            <Input
                                id="editDecisionExpiryDate"
                                type="date"
                                value={decisionExpiryDate}
                                onChange={(e) => setDecisionExpiryDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="editNextInspectionDate">Następne badanie</Label>
                            <Input
                                id="editNextInspectionDate"
                                type="date"
                                value={nextInspectionDate}
                                onChange={(e) => setNextInspectionDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Zapisz zmiany
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
