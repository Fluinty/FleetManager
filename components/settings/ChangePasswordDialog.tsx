"use client"

import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
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
import { changeUserPassword } from "@/app/actions/users"
import { Key, Loader2 } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Zmienianie...
                </>
            ) : (
                "Zmień hasło"
            )}
        </Button>
    )
}

interface ChangePasswordDialogProps {
    userId: string
    userEmail: string
}

export function ChangePasswordDialog({ userId, userEmail }: ChangePasswordDialogProps) {
    const [open, setOpen] = useState(false)
    const [state, formAction] = useActionState(changeUserPassword, { message: '', success: false })

    // Close dialog on success
    if (state.success && open) {
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Key className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zmień hasło użytkownika</DialogTitle>
                    <DialogDescription>
                        Ustaw nowe hasło dla: <strong>{userEmail}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction}>
                    <input type="hidden" name="userId" value={userId} />
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">Nowe hasło</Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Minimum 6 znaków"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Powtórz hasło"
                                required
                                minLength={6}
                            />
                        </div>
                        {state.message && !state.success && (
                            <p className="text-sm text-red-500">{state.message}</p>
                        )}
                        {state.message && state.success && (
                            <p className="text-sm text-green-500">{state.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Anuluj
                        </Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
