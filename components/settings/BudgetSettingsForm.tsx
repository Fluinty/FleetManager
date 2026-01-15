"use client"

import { useState } from "react"
import { updateBudgetLimit } from "@/app/actions/settings"
import { checkBudgetAlerts } from "@/app/actions/check-budget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BudgetSettingsFormProps {
    initialLimit: number
}

export function BudgetSettingsForm({ initialLimit }: BudgetSettingsFormProps) {
    const [limit, setLimit] = useState(initialLimit)
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await updateBudgetLimit(limit)
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Błąd",
                    description: result.error,
                })
            } else {
                toast({
                    title: "Sukces",
                    description: "Limit budżetu został zaktualizowany.",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Błąd",
                description: "Wystąpił nieoczekiwany błąd.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCheckBudget = async () => {
        setChecking(true)
        try {
            const result = await checkBudgetAlerts()
            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Błąd",
                    description: result.error,
                })
            } else if (result.success) {
                toast({
                    title: "Sukces",
                    description: `Utworzono ${result.count} nowych alertów.`,
                })
            } else if (result.message) {
                toast({
                    title: "Info",
                    description: result.message,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Błąd",
                description: "Wystąpił nieoczekiwany błąd.",
            })
        } finally {
            setChecking(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Globalny Limit Budżetu</CardTitle>
                <CardDescription>
                    Ustaw miesięczny limit wydatków na jeden pojazd. Przekroczenie tej kwoty spowoduje wygenerowanie alertu.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="budget-limit">Limit (PLN)</Label>
                        <Input
                            id="budget-limit"
                            type="number"
                            min="0"
                            step="100"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            disabled={loading}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Zapisz Zmiany
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCheckBudget} disabled={checking}>
                        {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Sprawdź Budżet
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
