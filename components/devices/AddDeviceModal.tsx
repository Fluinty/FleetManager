"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Loader2, Plus } from "lucide-react"
import { addDevice } from "@/app/actions/devices"

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

interface AddDeviceModalProps {
    vehicles: ActiveVehicle[]
    branches: Branch[]
}

export function AddDeviceModal({ vehicles, branches }: AddDeviceModalProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const [deviceType, setDeviceType] = useState<"lift" | "forklift">("lift")
    const [udtNumber, setUdtNumber] = useState("")
    const [vehicleId, setVehicleId] = useState("")
    const [name, setName] = useState("")
    const [branchId, setBranchId] = useState("")
    const [lastInspectionDate, setLastInspectionDate] = useState("")
    const [decisionExpiryDate, setDecisionExpiryDate] = useState("")
    const [nextInspectionDate, setNextInspectionDate] = useState("")

    // Auto-set branch when vehicle is selected (for lifts)
    const handleVehicleChange = (selectedVehicleId: string) => {
        setVehicleId(selectedVehicleId)
        const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
        if (selectedVehicle?.branch_id) {
            setBranchId(selectedVehicle.branch_id)
        }
    }

    const resetForm = () => {
        setDeviceType("lift")
        setUdtNumber("")
        setVehicleId("")
        setName("")
        setBranchId("")
        setLastInspectionDate("")
        setDecisionExpiryDate("")
        setNextInspectionDate("")
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
            const result = await addDevice({
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
                    description: "Urządzenie zostało dodane.",
                })
                setOpen(false)
                resetForm()
                router.refresh()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj urządzenie
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-teal-500" />
                        Nowe urządzenie UDT
                    </DialogTitle>
                    <DialogDescription>
                        Dodaj nowe urządzenie podlegające dozorowi technicznemu
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
                                    setBranchId("")
                                }}
                                className={deviceType === "forklift" ? "bg-amber-600 hover:bg-amber-700" : ""}
                            >
                                Wózek widłowy
                            </Button>
                        </div>
                    </div>

                    {/* UDT Number */}
                    <div>
                        <Label htmlFor="udtNumber">Nr UDT *</Label>
                        <Input
                            id="udtNumber"
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
                            <Label htmlFor="deviceName">Nazwa wózka *</Label>
                            <Input
                                id="deviceName"
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
                            <Label htmlFor="lastInspectionDate">Ostatnie badanie</Label>
                            <Input
                                id="lastInspectionDate"
                                type="date"
                                value={lastInspectionDate}
                                onChange={(e) => setLastInspectionDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="decisionExpiryDate">Termin decyzji</Label>
                            <Input
                                id="decisionExpiryDate"
                                type="date"
                                value={decisionExpiryDate}
                                onChange={(e) => setDecisionExpiryDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="nextInspectionDate">Następne badanie</Label>
                            <Input
                                id="nextInspectionDate"
                                type="date"
                                value={nextInspectionDate}
                                onChange={(e) => setNextInspectionDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Zapisz urządzenie
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
