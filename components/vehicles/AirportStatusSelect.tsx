'use client'

import { useState } from 'react'
import { updateVehicleAirportStatus } from '@/app/actions/vehicles'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface AirportStatusSelectProps {
    vehicleId: string
    initialValue: boolean | null
}

export function AirportStatusSelect({
    vehicleId,
    initialValue
}: AirportStatusSelectProps) {
    const [value, setValue] = useState(initialValue?.toString() ?? 'false')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    async function handleChange(newValue: string) {
        const previousValue = value
        setLoading(true)
        setValue(newValue)

        const result = await updateVehicleAirportStatus(
            vehicleId,
            newValue === 'true'
        )

        if (result.success) {
            toast({
                title: 'Zapisano',
                description: 'Status lotniska został zaktualizowany',
            })
        } else {
            toast({
                title: 'Błąd',
                description: result.error || 'Nie udało się zapisać zmian',
                variant: 'destructive',
            })
            // Revert to previous value on error
            setValue(previousValue)
        }

        setLoading(false)
    }

    return (
        <div className="w-24">
            <Select
                value={value}
                onValueChange={handleChange}
                disabled={loading}
            >
                <SelectTrigger className="h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="true">Tak</SelectItem>
                    <SelectItem value="false">Nie</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
