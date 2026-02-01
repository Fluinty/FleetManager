"use client"

import { Input } from "@/components/ui/input"
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
import { useDebounce } from "@/hooks/use-debounce"
import { X } from "lucide-react"

interface Branch {
    id: string
    name: string
}

interface VehiclesFiltersProps {
    branches: Branch[]
    showBranchFilter?: boolean
}

export function VehiclesFilters({ branches, showBranchFilter = true }: VehiclesFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [branch, setBranch] = useState(searchParams.get("branch") || "all")
    const [status, setStatus] = useState(searchParams.get("status") || "ACTIVE")

    const debouncedSearch = useDebounce(search, 300)

    useEffect(() => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()))

        if (debouncedSearch) {
            currentParams.set("search", debouncedSearch)
        } else {
            currentParams.delete("search")
        }

        if (branch && branch !== "all") {
            currentParams.set("branch", branch)
        } else {
            currentParams.delete("branch")
        }

        if (status && status !== "ALL") {
            currentParams.set("status", status)
        } else {
            currentParams.delete("status")
        }

        const searchString = currentParams.toString()
        const queryString = searchString ? `?${searchString}` : ""

        if (queryString !== window.location.search) {
            router.push(queryString)
        }
    }, [debouncedSearch, branch, status, router]) // Removed searchParams to prevent loop

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input
                placeholder="Szukaj (nr rej, marka, model)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />
            {showBranchFilter && (
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
            )}
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ACTIVE">Aktywne</SelectItem>
                    <SelectItem value="INACTIVE">Nieaktywne</SelectItem>
                    <SelectItem value="ALL">Wszystkie</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                    setSearch("")
                    setBranch("all")
                    setStatus("ACTIVE")
                }}
                title="Wyczyść filtry"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
