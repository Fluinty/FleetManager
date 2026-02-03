'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createUser } from "@/app/actions/users"
import { useToast } from "@/components/ui/use-toast"

export function AddUserDialog({ branches }: { branches: { id: string, name: string }[] }) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedBranches, setSelectedBranches] = useState<string[]>([])
    const router = useRouter()

    const handleBranchToggle = (branchId: string) => {
        setSelectedBranches(prev =>
            prev.includes(branchId)
                ? prev.filter(id => id !== branchId)
                : [...prev, branchId]
        )
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            // Add selected branches as comma-separated string
            formData.set('branch_ids', selectedBranches.join(','))

            const result = await createUser(null, formData)
            if (result.success) {
                setOpen(false)
                setSelectedRole('')
                setSelectedBranches([])

                toast({
                    title: "Sukces",
                    description: "Użytkownik został utworzony",
                })

                // Delay refresh slightly to ensure modal closes first
                setTimeout(() => {
                    router.refresh()
                    // Force reload if router.refresh() doesn't work
                    window.location.reload()
                }, 100)
            } else {
                toast({
                    variant: "destructive",
                    title: "Błąd",
                    description: result.message,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Błąd",
                description: "Coś poszło nie tak",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Dodaj użytkownika</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Dodaj nowego użytkownika</DialogTitle>
                    <DialogDescription>
                        Utwórz nowego użytkownika. Użytkownik będzie potrzebował tego hasła do pierwszego logowania.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Hasło
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            className="col-span-3"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Rola
                        </Label>
                        <Select name="role" required onValueChange={setSelectedRole}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Wybierz rolę" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="manager">Kierownik</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedRole === 'manager' && (
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">
                                Oddziały
                            </Label>
                            <div className="col-span-3 border rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                                {branches.map((branch) => (
                                    <div key={branch.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`branch-${branch.id}`}
                                            checked={selectedBranches.includes(branch.id)}
                                            onCheckedChange={() => handleBranchToggle(branch.id)}
                                        />
                                        <label
                                            htmlFor={`branch-${branch.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {branch.name}
                                        </label>
                                    </div>
                                ))}
                                {selectedBranches.length === 0 && (
                                    <p className="text-sm text-amber-600 mt-2">
                                        ⚠️ Użytkownik nie będzie miał dostępu do żadnych pojazdów
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedRole === 'admin' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <div className="col-span-4 text-sm text-muted-foreground italic text-center">
                                Administratorzy mają automatyczny dostęp do wszystkich oddziałów
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Tworzenie...' : 'Utwórz użytkownika'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
