"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Branch {
    id: string
    name: string
}

interface DevicesFiltersProps {
    branches: Branch[]
}

export function DevicesFilters({ branches }: DevicesFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [deviceType, setDeviceType] = useState(searchParams.get("type") || "all")
    const [branch, setBranch] = useState(searchParams.get("branch") || "all")

    useEffect(() => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()))

        if (deviceType && deviceType !== "all") {
            currentParams.set("type", deviceType)
        } else {
            currentParams.delete("type")
        }

        if (branch && branch !== "all") {
            currentParams.set("branch", branch)
        } else {
            currentParams.delete("branch")
        }

        const searchString = currentParams.toString()
        const queryString = searchString ? `?${searchString}` : ""

        if (queryString !== window.location.search) {
            router.push(queryString)
        }
    }, [deviceType, branch, router])

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Select value={deviceType} onValueChange={setDeviceType}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Typ urządzenia" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Wszystkie typy</SelectItem>
                    <SelectItem value="lift">Winda</SelectItem>
                    <SelectItem value="forklift">Wózek widłowy</SelectItem>
                </SelectContent>
            </Select>

            <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Wybierz oddział" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Wszystkie oddziały</SelectItem>
                    {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                            {b.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    setDeviceType("all")
                    setBranch("all")
                }}
                title="Wyczyść filtry"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
