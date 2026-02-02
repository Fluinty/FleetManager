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
import { createUser } from "@/app/actions/users"
import { useToast } from "@/components/ui/use-toast"

export function AddUserDialog({ branches }: { branches: { id: string, name: string }[] }) {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            const role = formData.get('role')
            const branchId = formData.get('branch_id')

            // We need to handle select values manually if radix doesn't sync perfectly with FormData in all versions,
            // but Radix Select should handle 'name' prop.
            // Just in case, logging.

            const result = await createUser(null, formData)
            if (result.success) {
                toast({
                    title: "Sukces",
                    description: "Użytkownik został utworzony",
                })
                setOpen(false)
                router.refresh()
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
            <DialogContent className="sm:max-w-[425px]">
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
                        <Select name="role" required>
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="branch_id" className="text-right">
                            Oddział
                        </Label>
                        <Select name="branch_id">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Wybierz oddział (opcjonalne)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {branches.map(branch => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
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
