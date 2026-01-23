"use client"

import { useState } from "react"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Car, Mail, Lock, ArrowRight } from "lucide-react"

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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows - Adjusted for Light Mode */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[100px] animate-float opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[100px] animate-float opacity-60 pointer-events-none" style={{ animationDelay: '3s' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-2xl shadow-teal-500/20 mb-6 animate-pulse-soft border border-white/40">
                        <Car className="h-10 w-10 text-white drop-shadow-md" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold text-slate-800 tracking-tight font-[var(--font-space-grotesk)]">
                            fluinty<span className="text-teal-600">.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-light tracking-wide">Fleet Manager</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="glass-premium rounded-[32px] p-8 md:p-10 animate-fade-in backdrop-blur-3xl shadow-xl border border-white/60" style={{ animationDelay: '150ms' }}>
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Witaj ponownie</h2>
                        <p className="text-slate-500 text-sm">Zaloguj się, aby zarządzać flotą</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="group space-y-2">
                                <Label htmlFor="email" className="text-slate-600 font-medium ml-1 text-xs uppercase tracking-wider">
                                    Email Firmowy
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        disabled={loading}
                                        className="pl-12 h-12 bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="group space-y-2">
                                <Label htmlFor="password" className="text-slate-600 font-medium ml-1 text-xs uppercase tracking-wider">
                                    Hasło
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••••••"
                                        required
                                        disabled={loading}
                                        className="pl-12 h-12 bg-white/50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 animate-fade-in flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-base rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold shadow-lg shadow-teal-500/25 border-none transition-all duration-300 hover:shadow-teal-500/40 hover:-translate-y-0.5 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Weryfikacja...
                                </>
                            ) : (
                                <>
                                    Zaloguj się
                                    <ArrowRight className="ml-2 h-5 w-5 opacity-90 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-400 text-xs mt-8 font-medium tracking-wide animate-fade-in opacity-80" style={{ animationDelay: '250ms' }}>
                    © 2026 Fleet Manager by Fluinty
                </p>
            </div>
        </div>
    )
}
