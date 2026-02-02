"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, FileText } from "lucide-react"
import { addManualInvoice } from "@/app/actions/add-manual-invoice"
import { format } from "date-fns"

interface InvoiceFormData {
    orderDate: string
    supplier: string
    description: string
    items: Array<{
        name: string
        sku: string
        quantity: number
        unitPriceNet: number
        vatRate: number
    }>
}

interface AddInvoiceModalProps {
    vehicleId: string
    vehiclePlate: string
}

const VAT_RATES = [
    { label: "23%", value: 23 },
    { label: "8%", value: 8 },
    { label: "5%", value: 5 },
    { label: "0%", value: 0 },
    { label: "zw.", value: 0 },
]

export function AddInvoiceModal({ vehicleId, vehiclePlate }: AddInvoiceModalProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<InvoiceFormData>({
        defaultValues: {
            orderDate: format(new Date(), "yyyy-MM-dd"),
            supplier: "",
            description: "",
            items: [
                {
                    name: "",
                    sku: "",
                    quantity: 1,
                    unitPriceNet: 0,
                    vatRate: 23,
                },
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    })

    const watchItems = watch("items")

    const calculateItemTotals = (index: number) => {
        const item = watchItems[index]
        if (!item) return { unitGross: 0, totalNet: 0, totalGross: 0 }

        const unitGross = item.unitPriceNet * (1 + item.vatRate / 100)
        const totalNet = item.unitPriceNet * item.quantity
        const totalGross = unitGross * item.quantity

        return {
            unitGross: Math.round(unitGross * 100) / 100,
            totalNet: Math.round(totalNet * 100) / 100,
            totalGross: Math.round(totalGross * 100) / 100,
        }
    }

    const calculateInvoiceTotals = () => {
        let totalNet = 0
        let totalGross = 0

        watchItems.forEach((_item: unknown, index: number) => {
            const totals = calculateItemTotals(index)
            totalNet += totals.totalNet
            totalGross += totals.totalGross
        })

        return {
            totalNet: Math.round(totalNet * 100) / 100,
            totalGross: Math.round(totalGross * 100) / 100,
        }
    }

    const invoiceTotals = calculateInvoiceTotals()

    const onSubmit = async (data: InvoiceFormData) => {
        setLoading(true)

        try {
            const result = await addManualInvoice(vehicleId, data)

            if (result.error) {
                toast({
                    title: "Błąd",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Sukces",
                    description: "Faktura została dodana.",
                })
                setOpen(false)
                reset()
                router.refresh()
            }
        } catch (error) {
            toast({
                title: "Błąd",
                description: "Wystąpił nieoczekiwany błąd.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Dodaj fakturę
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-teal-500" />
                        Nowa faktura - {vehiclePlate}
                    </DialogTitle>
                    <DialogDescription>
                        Dodaj fakturę z wieloma pozycjami dla tego pojazdu
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Invoice Header */}
                    <div className="space-y-4 border-b pb-4">
                        <h3 className="font-semibold">Nagłówek faktury</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="orderDate">Data *</Label>
                                <Input
                                    id="orderDate"
                                    type="date"
                                    {...register("orderDate", { required: true })}
                                />
                                {errors.orderDate && (
                                    <span className="text-xs text-red-500">Pole wymagane</span>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="supplier">Dostawca *</Label>
                                <Input
                                    id="supplier"
                                    {...register("supplier", { required: true })}
                                    placeholder="Nazwa dostawcy"
                                />
                                {errors.supplier && (
                                    <span className="text-xs text-red-500">Pole wymagane</span>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="description">Opis</Label>
                                <Input
                                    id="description"
                                    {...register("description")}
                                    placeholder="Opcjonalnie"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Pozycje faktury</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        name: "",
                                        sku: "",
                                        quantity: 1,
                                        unitPriceNet: 0,
                                        vatRate: 23,
                                    })
                                }
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Dodaj pozycję
                            </Button>
                        </div>

                        {fields.map((field: { id: string }, index: number) => {
                            const totals = calculateItemTotals(index)
                            return (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg bg-gray-50"
                                >
                                    <div className="col-span-3">
                                        <Label className="text-xs">Nazwa *</Label>
                                        <Input
                                            {...register(`items.${index}.name`, { required: true })}
                                            placeholder="Nazwa części"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Label className="text-xs">SKU</Label>
                                        <Input
                                            {...register(`items.${index}.sku`)}
                                            placeholder="Opcjonalnie"
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <Label className="text-xs">Ilość *</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            step="1"
                                            {...register(`items.${index}.quantity`, {
                                                required: true,
                                                valueAsNumber: true,
                                                min: 1,
                                            })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Netto/szt *</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...register(`items.${index}.unitPriceNet`, {
                                                required: true,
                                                valueAsNumber: true,
                                                min: 0,
                                            })}
                                            className="h-8"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">VAT *</Label>
                                        <Select
                                            value={watchItems[index]?.vatRate?.toString() || "23"}
                                            onValueChange={(value) =>
                                                setValue(`items.${index}.vatRate`, Number(value))
                                            }
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {VAT_RATES.map((rate) => (
                                                    <SelectItem key={rate.value} value={rate.value.toString()}>
                                                        {rate.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Suma brutto</Label>
                                        <Input
                                            value={totals.totalGross.toFixed(2)}
                                            disabled
                                            className="h-8 bg-gray-200"
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            className="h-8"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Invoice Summary */}
                    <div className="border-t pt-4 space-y-2">
                        <h3 className="font-semibold">Podsumowanie</h3>
                        <div className="flex justify-end space-x-8 text-sm">
                            <div>
                                <span className="text-muted-foreground">Suma netto:</span>
                                <span className="ml-2 font-semibold">
                                    {invoiceTotals.totalNet.toFixed(2)} PLN
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Suma brutto:</span>
                                <span className="ml-2 font-semibold text-lg">
                                    {invoiceTotals.totalGross.toFixed(2)} PLN
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Zapisz fakturę
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
