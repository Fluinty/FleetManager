"use client"

import { useState } from "react"
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
import { resolvePendingOrder } from "@/app/actions/resolve-pending"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface VehicleOption {
    id: string
    plate_number: string
}

interface PendingResolverProps {
    orderId: string
    initialPlate?: string | null
    vehicles: VehicleOption[]
    fullWidth?: boolean
}

export function PendingResolver({ orderId, initialPlate, vehicles, fullWidth = false }: PendingResolverProps) {
    const [open, setOpen] = useState(false)
    const [plate, setPlate] = useState(initialPlate || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            // Check if plate matches a vehicle (should be selected from dropdown, but just in case)
            // Ideally resolvePendingOrder might need update if we pass ID directly, 
            // but for now we pass plate string as the server action looks it up.
            // Wait, if we have the ID, we should probably pass the ID to avoid lookup?
            // The existing action takes (orderId, plate_string).
            // Let's pass the plate string from the select value.

            const result = await resolvePendingOrder(orderId, plate)
            if (result.error) {
                setError(result.error)
            } else {
                setOpen(false)
                toast({
                    title: "Sukces",
                    description: "Zamówienie zostało przypisane.",
                })
            }
        } catch {
            setError("Wystąpił nieoczekiwany błąd.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={fullWidth ? "default" : "outline"}
                    size={fullWidth ? "default" : "sm"}
                    className={fullWidth ? "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-md" : ""}
                >
                    {fullWidth ? "Przypisz pojazd" : "Rozwiąż"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rozwiąż problem z zamówieniem</DialogTitle>
                    <DialogDescription>
                        Wybierz pojazd z listy, aby przypisać zamówienie.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="plate" className="text-right">
                                Pojazd
                            </Label>
                            <div className="col-span-3">
                                <Select value={plate} onValueChange={setPlate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wybierz pojazd..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v.id} value={v.plate_number}>
                                                {v.plate_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !plate}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Zapisz
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
