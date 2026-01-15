"use client"

import { useState } from "react"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Mail, Lock } from "lucide-react"

export default function LoginPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 mb-4 animate-pulse-glow">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">ART-TIM Fleet</h1>
                    <p className="text-white/60">Zaloguj się do panelu zarządzania</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl shadow-purple-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-600 font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@art-tim.pl"
                                required
                                disabled={loading}
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-600 font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Hasło
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••••••"
                                required
                                disabled={loading}
                                className="h-12"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 animate-fade-in">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Logowanie...
                                </>
                            ) : (
                                "Zaloguj się"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-sm mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    © 2026 Art-Tim Fleet Manager. Powered by Fluinty.
                </p>
            </div>
        </div>
    )
}
