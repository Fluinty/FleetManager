'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateVehicleBranch } from '@/app/actions/vehicles'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface Branch {
    id: string
    name: string
}

interface BranchSelectProps {
    vehicleId: string
    currentBranchId: string
    availableBranches: Branch[]
}

export function BranchSelect({
    vehicleId,
    currentBranchId,
    availableBranches
}: BranchSelectProps) {
    const [value, setValue] = useState(currentBranchId)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    async function handleChange(newBranchId: string) {
        if (newBranchId === currentBranchId) return

        const previousValue = value
        setLoading(true)
        setValue(newBranchId)

        const result = await updateVehicleBranch(vehicleId, newBranchId)

        if (result.success) {
            toast({
                title: 'Zapisano',
                description: 'Oddział został zmieniony',
            })

            // Redirect to vehicles list after short delay
            setTimeout(() => {
                router.push('/vehicles')
            }, 500)
        } else {
            toast({
                title: 'Błąd',
                description: result.error || 'Nie udało się zmienić oddziału',
                variant: 'destructive',
            })
            // Revert to previous value on error
            setValue(previousValue)
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <Select
                value={value}
                onValueChange={handleChange}
                disabled={loading}
            >
                <SelectTrigger className="h-8">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableBranches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
