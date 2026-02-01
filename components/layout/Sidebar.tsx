"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, ShoppingCart, AlertTriangle, Bell, Settings, BarChart3, LogOut, User, Sparkles, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"
import { useState, useEffect } from "react"

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Pojazdy", href: "/vehicles", icon: Car },
    { name: "Zamówienia", href: "/orders", icon: ShoppingCart },
    { name: "Do weryfikacji", href: "/pending", icon: AlertTriangle },
    { name: "Statystyki", href: "/statistics", icon: BarChart3 },
    { name: "Alerty", href: "/alerts", icon: Bell },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Close sidebar when route changes (mobile)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-40 flex md:hidden items-center justify-between h-16 px-4 glass-premium border-none shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="font-bold text-lg text-slate-800 font-[var(--font-space-grotesk)] tracking-tight">fluinty<span className="text-teal-600">.</span></h1>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors border border-slate-200"
                    aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed md:relative z-50 flex h-full w-72 flex-col glass-premium border-r border-slate-200/60 shadow-xl transition-transform duration-300 ease-in-out md:shadow-none",
                // Mobile: slide in from left
                "md:translate-x-0 h-screen md:h-auto",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                {/* Logo Section - hidden on mobile (shown in header) */}
                <div className="hidden md:flex h-24 items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md shadow-teal-500/20 transition-transform group-hover:scale-105 duration-300">
                            <Car className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-slate-800 tracking-tight font-[var(--font-space-grotesk)]">fluinty<span className="text-teal-600">.</span></h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">Fleet Manager</p>
                        </div>
                    </div>
                </div>

                {/* Mobile: Add top padding to account for header */}
                <div className="h-20 md:hidden" />

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
                    {navigation.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300",
                                    "animate-fade-in",
                                    isActive
                                        ? "text-teal-700 bg-teal-50/80"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Active State Indicator Line */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-teal-500 rounded-r-full shadow-sm" />
                                )}

                                <item.icon
                                    className={cn(
                                        "mr-3.5 h-5 w-5 flex-shrink-0 transition-transform duration-300",
                                        isActive
                                            ? "text-teal-600 scale-105 drop-shadow-sm"
                                            : "text-slate-500 group-hover:text-slate-700 group-hover:scale-105"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}

                                {isActive && (
                                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-500 shadow-sm" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer Section */}
                <div className="border-t border-slate-100 p-4 space-y-2 bg-slate-50/50">
                    <Link
                        href="/settings"
                        className={cn(
                            "group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-300",
                            pathname === "/settings"
                                ? "bg-teal-50 text-teal-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-slate-700 transition-transform group-hover:rotate-90 duration-500" />
                        Ustawienia
                    </Link>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-2xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 text-left"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-red-500 transition-transform group-hover:-translate-x-1" />
                            Wyloguj
                        </button>
                    </form>

                    {/* User Info */}
                    <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-2xl bg-white/60 border border-slate-200 shadow-sm">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center ring-2 ring-white">
                            <User className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">Admin</p>
                            <p className="text-xs text-slate-500 truncate">administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
