"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { resolvePendingItem, resolvePendingOrderItems } from "@/app/actions/resolve-pending-item"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Car, Package } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface VehicleOption {
    id: string
    plate_number: string
}

interface PendingItem {
    id: string
    name: string | null
    sku: string | null
    total_gross: number | null
}

interface ItemResolverProps {
    itemId: string
    orderId: string
    itemName?: string | null
    allItems?: PendingItem[]
    vehicles: VehicleOption[]
    fullWidth?: boolean
}

export function ItemResolver({
    itemId,
    orderId,
    itemName,
    allItems = [],
    vehicles,
    fullWidth = false
}: ItemResolverProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [plate, setPlate] = useState("")
    const [applyToAll, setApplyToAll] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { toast } = useToast()

    const hasMultipleItems = allItems.length > 1

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            let result

            if (applyToAll && hasMultipleItems) {
                // Resolve all items in the order
                result = await resolvePendingOrderItems(orderId, plate)
            } else {
                // Resolve just this item
                result = await resolvePendingItem(itemId, plate)
            }

            if (result.error) {
                setError(result.error)
            } else {
                setOpen(false)
                setPlate("")
                setApplyToAll(false)
                toast({
                    title: "Sukces",
                    description: applyToAll && hasMultipleItems
                        ? `Przypisano ${allItems.length} pozycji do pojazdu.`
                        : "Pozycja została przypisana do pojazdu.",
                })
                // Refresh page to re-fetch data and remove resolved item from list
                router.refresh()
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
                    <Car className="h-4 w-4 mr-1" />
                    {fullWidth ? "Przypisz pojazd" : "Przypisz"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-500" />
                        Przypisz pojazd do pozycji
                    </DialogTitle>
                    <DialogDescription>
                        {itemName ? (
                            <span>Przypisz pojazd dla: <strong>{itemName}</strong></span>
                        ) : (
                            "Wybierz pojazd z listy, aby przypisać pozycję."
                        )}
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

                        {hasMultipleItems && (
                            <div className="flex items-center space-x-2 px-4 py-3 bg-purple-50 rounded-lg border border-purple-100">
                                <Checkbox
                                    id="applyToAll"
                                    checked={applyToAll}
                                    onCheckedChange={(checked) => setApplyToAll(checked === true)}
                                />
                                <label
                                    htmlFor="applyToAll"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Zastosuj do wszystkich {allItems.length} pozycji w zamówieniu
                                </label>
                            </div>
                        )}

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !plate}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {applyToAll && hasMultipleItems ? "Przypisz wszystkie" : "Przypisz"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
